import axiosInstance from "@/lib/axiosInstance";

export async function getLocations() {
  const response = await axiosInstance.get("/locations");
  return response.data;
}

export async function createParty(partyData) {
  const response = await axiosInstance.post("/parties", partyData);
  return response.data;
}

export async function getParties(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  );

  const response = await axiosInstance.get("/parties", { params });
  return response.data;
}
