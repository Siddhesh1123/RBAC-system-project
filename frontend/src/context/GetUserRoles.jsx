export const getUserRole = (roleId) => {
    switch(roleId){
      case "67447ddd870d4b2714192657":
        return 'Admin';
      case "67447ddd870d4b2714192658":
        return 'Editor';
      case "67447ddd870d4b2714192659":
        return 'Viewer';
    }
  }