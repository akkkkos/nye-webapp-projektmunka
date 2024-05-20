import React, { FC, useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Center, Flex} from '@chakra-ui/react';
import { useAuthContext } from '../auth/authContext';
import { AuthProvider } from '../auth/authProvider';
import { UserEditorForm } from './AdatMentes';
import { useNavigate, useLocation } from 'react-router-dom';


export const UserProfile: FC = () => {
  const { user, logout, authToken,setUser} = useAuthContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Set user data if logged in
    if (user) {
      setUserData(user);
    }
  }, [user]); // Re-run effect when `user` changes

  useEffect(()=>{
    if (authToken===null){
     navigate("/login")
    }
  },[authToken] )
  const [userData, setUserData,] = useState<any>(null);
  const handleEditSubmit = (firstName: string, lastName: string) => {
    // Töltsd fel az adatokat a szervert
    // onSubmit(firstName, lastName);
    setIsEditing(false); // Visszaállítjuk a szerkesztési módot
    setUserData({ ...userData, firstName: firstName, lastName: lastName });
    
    
  };
  const handleSaveSubmit = (firstName: string, lastName: string) => {
    // Extra tevékenységek mentéskor
   // setUser(userData.firstName, userData.lastName)
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
        <Button onClick={logout} marginTop="4" marginLeft="4">
          Kijelentkezés
        </Button>
      </Flex>
    </>
  );
};
