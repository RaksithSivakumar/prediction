
const PYTHON_API_URL = "https://tridev24-model.hf.space";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Health check
export async function GET() {
  try {
    const response = await fetch(
      `${PYTHON_API_URL}/api/health`,
      { signal: AbortSignal.timeout(15000) }
    );

    const result = await response.json();

    if (!response.ok) {
      return jsonResponse({
        nextjs_status: "healthy",
        python_server: result,
      }, response.status);
    }

    return jsonResponse({
      nextjs_status: "healthy",
      python_server: result,
    });

  } catch (error) {
    console.error("Python health check failed:", error);

    return jsonResponse({
      nextjs_status: "healthy",
      python_server: {
        status: "unreachable",
        error: error.message,
      },
    }, 503);
  }
}

// Disease prediction
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let pythonResponse;

    // Base64 JSON request
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { imageData } = body;

      if (!imageData) {
        return jsonResponse({
          success: false,
          error: "No image data provided",
        }, 400);
      }

      pythonResponse = await fetch(
        `${PYTHON_API_URL}/api/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData }),
          signal: AbortSignal.timeout(120000),
        }
      );
    }

    // Multipart image upload
    else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image");

      if (
        !image ||
        typeof image === "string" ||
        typeof image.arrayBuffer !== "function"
      ) {
        return jsonResponse({
          success: false,
          error: "No valid image file provided",
        }, 400);
      }

      const newForm = new FormData();

      newForm.append(
        "image",
        image,
        image.name
      );

      pythonResponse = await fetch(
        `${PYTHON_API_URL}/api/predict`,
        {
          method: "POST",
          body: newForm,
          signal: AbortSignal.timeout(120000),
        }
      );
    }

    // Unsupported content type
    else {
      return jsonResponse({
        success: false,
        error: "Unsupported Content-Type",
      }, 415);
    }

    // Handle Python API response
    const responseText = await pythonResponse.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("Invalid Python API response:", responseText);

      return jsonResponse({
        success: false,
        error: "Invalid response from prediction server",
      }, 502);
    }

    return jsonResponse(result, pythonResponse.status);

  } catch (error) {
    console.error("Prediction API error:", error);

    const isTimeout = error.name === "TimeoutError";

    return jsonResponse({
      success: false,
      error: isTimeout
        ? "Prediction server timed out"
        : "Prediction failed",
      message: error.message,
    }, isTimeout ? 504 : 500);
  }
}
