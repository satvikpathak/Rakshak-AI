import insecam from "insecam-api";

export async function POST(request) {
  try {
    const { type } = await request.json();
    let cameraIds;

    switch (type) {
      case "new":
        cameraIds = await insecam.new;
        break;
      case "rating":
        cameraIds = await insecam.rating;
        break;
      case "country":
        cameraIds = await insecam.country("US");
        break;
      case "places":
        cameraIds = await insecam.place("City");
        break;
      default:
        cameraIds = await insecam.new;
    }

    if (!Array.isArray(cameraIds)) {
      throw new Error("Expected cameraIds to be an array");
    }

    const cameras = await Promise.all(
      cameraIds.map(id => insecam.camera(id))
    );

    return Response.json({ cameras });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
