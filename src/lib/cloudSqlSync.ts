/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
export async function getCloudSqlStatus() {
  try {
    const res = await fetch("/api/cloudsql/status");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        connected: false,
        error: data.error || `HTTP ${res.status}: Gagal menghubungi server backend Cloud SQL`
      };
    }
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      error: err.message || "Gagal menghubungi API Cloud SQL"
    };
  }
}
export async function syncDataToCloudSql(payload) {
  try {
    const res = await fetch("/api/cloudsql/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Gagal menyimpan ke Cloud SQL`
      };
    }
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.message || "Gagal sinkronisasi data ke Cloud SQL"
    };
  }
}
export async function loadDataFromCloudSql() {
  try {
    const res = await fetch("/api/cloudsql/load");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Gagal mengambil data Cloud SQL`
      };
    }
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.message || "Gagal memuat data dari Cloud SQL"
    };
  }
}
