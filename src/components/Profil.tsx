import React, { FC, useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Center, Flex} from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { AuthProvider } from '../auth/authProvider';
import { UserEditorForm } from './AdatMentes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebshopApi } from '../state/useWebshopApi';
import ChangePassword from './JelszoModositas'; 

export const UserProfile: FC = () => {
  const { user, logout, authToken,setUser} = useAuthContext();
  const { putUserData } = useWebshopApi();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); 
  const navigate = useNavigate();
  useEffect(() => {
 
    if (user) {
      setUserData(user);
    }
  }, [user]); 

  useEffect(()=>{
    if (authToken===null){
     navigate("/login")
    }
  },[authToken] )
  const [userData, setUserData,] = useState<any>(null);
  const handleEditSubmit = async(firstName: string, lastName: string) => {
    
    
    try {
      await putUserData(authToken, firstName, lastName);
      setIsEditing(false);
      setUserData({ ...userData, firstName: firstName, lastName: lastName });
  } catch (error) {
      console.error('Error while submitting data:', error);
  }
    setIsEditing(false); 
    setUserData({ ...userData, firstName: firstName, lastName: lastName });
    
    
  };
  const handleSaveSubmit = (firstName: string, lastName: string) => {
    
    console.log('Save submit:', firstName, lastName);
  };
  
   if (!user) {
    return (
      <Box textAlign="center">
        <Text fontSize="xl" >A profil megtekintéséhez kérjük, jelentkezz be.</Text>
      </Box>
    );
  }

  return (
    <>
      <Box textAlign="center">
        <Heading as="h2" marginBottom="4">
          Profil
        </Heading>
        {isEditing ? (
          <UserEditorForm
            firstName={userData?.firstName?? ''}
            lastName={userData?.lastName?? ''}
            onSubmit={handleEditSubmit}
            onSaveSubmit={handleSaveSubmit} 
          />
        ) : (
          <>
            <Text fontSize="xl">
              Üdvözöljük, {userData?.firstName} {userData?.lastName}!
            </Text>
            <Text>E-mail cím: {user.email}</Text>
          </>
        )}
      </Box>
      <Flex justifyContent="flex-end">
        {isEditing ? (
          <Button onClick={() => setIsEditing(false)} marginTop="4">
            Mégse
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} marginTop="4">
            Profil szerkesztése
          </Button>
        )}
        <Button onClick={() => setIsChangingPassword(true)} marginTop="4" marginLeft="4"> 
          Jelszó módosítása
        </Button>
        <Button onClick={logout} marginTop="4" marginLeft="4">
          Kijelentkezés
        </Button>
      </Flex>
      {isChangingPassword && <ChangePassword />} 
    </>
  );
};
