import { getCookies } from "@/helper/cookies";

export default async function AdminProfile() {
  const token = await getCookies("token_kuliner");

  if (!token) {
    return <p className="p-10">Silakan login terlebih dahulu ya!</p>;
  }

  // Mengambil data dari backend
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const result = await response.json();
  const profile = result.data || result;

  // Jika error (misal 403 atau 401)
  if (!response.ok) {
    return <p className="p-10 text-red-500">Gagal mengambil data profil (Error {response.status})</p>;
  }

  // Tampilan sederhana
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Profil Saya</h1>
      
      <div className="border p-6 rounded-lg shadow-sm bg-white max-w-md">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Nama Lengkap</p>
          <p className="font-semibold">{profile.name}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Alamat Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Role Akun</p>
          <p className="font-semibold bg-gray-100 inline-block px-2 rounded">
            {profile.role}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Tanggal Dibuat</p>
          <p className="font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}