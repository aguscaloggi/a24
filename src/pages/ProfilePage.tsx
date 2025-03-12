import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import "../css/ProfilePage.css";

// Interfaces TypeScript
interface UserData {
  id: string;
  name?: string;
  phone?: string;
  profilepic?: string;
  bannerimg?: string;
  location?: Location;
  agency?: boolean;
  activityStart?: number;
  googlemaplocation?: string;
}

interface Location {
  city?: string;
  state?: string;
  cp?: string;
  street?: string;
  streetNumber?: string;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAgency, setIsAgency] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [bannerImg, setBannerImg] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userInfo = await API.get('userApi', '/users/me', {});
        setUserData(userInfo);
        setIsAgency(userInfo.agency || false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleImageUpload = async (file: File, isBanner = false) => {
    try {
      const result = await Storage.put(file.name, file, {
        contentType: file.type
      });
      return await Storage.get(result.key);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updates: Partial<UserData> = {};

    try {
      // Subir imágenes
      if (profilePic) updates.profilepic = await handleImageUpload(profilePic);
      if (bannerImg) updates.bannerimg = await handleImageUpload(bannerImg, true);

      // Actualizar datos
      updates.name = formData.get('name') as string;
      updates.phone = formData.get('phone') as string;
      updates.location = {
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        cp: formData.get('cp') as string
      };

      if (isAgency) {
        updates.agency = true;
        updates.location.street = formData.get('street') as string;
        updates.location.streetNumber = formData.get('streetNumber') as string;
        updates.activityStart = Number(formData.get('activityStart'));
        updates.googlemaplocation = formData.get('googlemap') as string;

        await API.post('agencyApi', '/agencies', { body: updates });
      }

      await API.put('userApi', '/users/me', { body: updates });
      alert('Perfil actualizado!');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Error al actualizar el perfil');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="profile-container">
      <h3>Tu cuenta</h3>
      <span>Editá y completá tu perfil.</span>
      
      {!userData?.agency && (
        <div className="account-type-selector">
          <label className="radio-option">
            <input 
              type="radio" 
              name="accountType" 
              checked={!isAgency}
              onChange={() => setIsAgency(false)}
            />
            <span className="radio-custom"></span>
            Particular
          </label>
          
          <label className="radio-option">
            <input 
              type="radio" 
              name="accountType" 
              checked={isAgency}
              onChange={() => setIsAgency(true)}
            />
            <span className="radio-custom"></span>
            Agencia
          </label>
        </div>      
      )}

      <form onSubmit={handleSubmit}>
        <div className='name-section'>
          <input name="name" defaultValue={userData?.name} placeholder="Nombre completo" required />
        </div>
        
        <div className='contact'>
          <input name="phone" defaultValue={userData?.phone} placeholder="Teléfono" required />
        </div>

        <div className="location-section">
          <input name="state" defaultValue={userData?.location?.state} placeholder="Provincia" required />
          <input name="city" defaultValue={userData?.location?.city} placeholder="Ciudad" required />
          <input name="cp" defaultValue={userData?.location?.cp} placeholder="Código Postal" required />
        </div>

        {isAgency && (
          <>
            <input name="street" defaultValue={userData?.location?.street} placeholder="Calle" />
            <input name="streetNumber" defaultValue={userData?.location?.streetNumber} placeholder="Número" />
            <input name="activityStart" type="number" defaultValue={userData?.activityStart} placeholder="Año de inicio" />
            <input name="googlemap" defaultValue={userData?.googlemaplocation} placeholder="URL Google Maps" />
            
            <label>
              Banner de la agencia:
              <input type="file" onChange={(e) => setBannerImg(e.target.files?.[0] || null)} />
            </label>
          </>
        )}

        <label>
          Foto de perfil:
          <input type="file" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
        </label>

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default ProfilePage;
