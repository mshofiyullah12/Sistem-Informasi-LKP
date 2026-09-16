export const saveLPKDataToFirestore = async (data: any) => {
  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch(e) {
    console.error("SQL Sync error", e);
  }
};
export const loadLPKDataFromFirestore = async () => null;
export const saveUserSessionToFirestore = async () => {};
export const deleteUserSessionFromFirestore = async () => {};
export const enableNetworkSync = () => {};
export const disableNetworkSync = () => {};
export const loadUserSessionFromFirestore = async () => null;
