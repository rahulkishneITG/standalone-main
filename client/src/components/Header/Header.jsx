// import React, { useContext, useEffect } from 'react';
// import { Avatar, Text, Button, Icon } from '@shopify/polaris';
// import styles from './Header.module.css';
// import { ArrowLeftIcon, MenuIcon } from '@shopify/polaris-icons';
// import useSidebarStore from '../../store/sidebarStore';
// import { AuthContext } from '../../context/AuthContext';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import FullPageLoader from '../Loader';
// import { exportToCSV } from '../../utils/exportCsv.js';
// import { useAttendeeStore } from '../../store/attendeeStore';
// import ExportCSVButton from '../ExportCSVButton.jsx';
// import { useUserProfileStore } from '../../store/userSettingsStore.js';


// const Header = () => {
//   const { toggleSidebar } = useSidebarStore();
//   const { user, loading } = useContext(AuthContext);
//   const location = useLocation();
//   const { attendees } = useAttendeeStore();
//   const navigate = useNavigate();
 
//   const [name, setName] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [file, setFile] = useState(null);
//   const {
//     userProfile,
//     fetchUserProfile,
//     updateUserProfile,
//     profileLoading,
//     profileMessage,
//   } = useUserProfileStore();

//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   useEffect(() => {
//     if (userProfile) {
//       console.log(userProfile);
//       setName(userProfile.name || '');
//       setImageUrl(userProfile.imageUrl || '');
//     }
//   }, [userProfile]);
//   if (loading) {
//     return <FullPageLoader />;
//   }

//   const getPageTitle = () => {
//     const path = location.pathname;

//     if (path === '/') return 'Home';
//     if (path.startsWith('/event/create')) return 'Create Event';
//     if (path.startsWith('/event/edit')) return 'Edit Event';
//     if (path.startsWith('/event')) return 'All Event';
//     if (path.startsWith('/attendee')) return 'All Attendee';
//     if (path.startsWith('/walkin')) return 'Walkin';
//     if (path.startsWith('/email')) return 'Emails';
//     if (path.startsWith('/walkin/walkin-form')) return 'Walkin Form';

//     return 'Dashboard';
//   };
  
 
//   const getPageActions = () => {
//     const path = location.pathname;
//     if (path === '/') {
//       return (
//         <>
//           <Link to="/event/create">
//             <Button variant="primary" tone="primary">Create Event</Button>
//           </Link>
//           <Link to="/attendee">
//             <Button variant="primary" tone="primary">View Attendee List</Button>
//           </Link>
//         </>
//       );
//     }
//     if (path.startsWith('/event/create') || path.startsWith('/event/edit')) {
//       return null;
//     }

//     if (path.startsWith('/event')) {
//       return (
//         <Link to="/event/create">
//           <Button variant="primary" tone="primary">Create Event</Button>
//         </Link>
//       );
//     }

//     if (path.startsWith('/attendee')) {
//       return (
//         <>
//           <Link to="/attendee">
//             <ExportCSVButton />
//           </Link>
//           {/* <Link to="/attendee/import">
//             <Button variant="primary" tone="primary">Bulk import attendees</Button>
//           </Link> */}
//         </>
//       );
//     }

//     return null;
//   };
  
//   return (
//     <div className={styles.header}>
//       <div className={styles.headerContainer}>
//         <div className={styles.headerAvatar}>
//           <div className={styles.sidebarToggle} onClick={toggleSidebar}>
//             <Icon source={MenuIcon} />
//           </div>
//           <div className={styles.headerAvatarInfo}>
//             <div className={styles.headerAvatarIcon}>
//             {userProfile.imageUrl? (
//                   <img
//                     src={userProfile.imageUrl}
//                     alt="Profile"
//                     style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
//                   />
//                 ) : (
//                   <Avatar size="large" name={user?.name} />
//                 )}
//             </div>
//             <Text variant="bodyMd" fontWeight="medium">
//               {user?.name || 'User'}
//             </Text>
//           </div>
//         </div>
//         <div className={styles.headerBottom}>
//           <Text variant="headingLg" as="h2" fontWeight="semibold">
//             <div className={styles.headerBottomTitle}>
//               {(location.pathname.startsWith('/event/create') || location.pathname.startsWith('/event/edit') ||
//                 location.pathname.startsWith('/walkin/walkin-form')) && (
//                   <div className={styles.backButton} onClick={() => {if (location.pathname.startsWith('/walkin/walkin-form')) {
//                     navigate('/walkin');
//                   } else {
//                     navigate('/event');
//                   }}
//                   } style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     <Icon source={ArrowLeftIcon} tone="base" />
//                   </div>
//                 )}
//               {getPageTitle()}
//             </div>
//           </Text>
//           <div className={styles.headerBottomButtons}>
//             {getPageActions()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Text, Button, Icon } from '@shopify/polaris';
import styles from './Header.module.css';
import { ArrowLeftIcon, MenuIcon } from '@shopify/polaris-icons';
import useSidebarStore from '../../store/sidebarStore';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FullPageLoader from '../Loader';
import ExportCSVButton from '../ExportCSVButton.jsx';
import { useUserProfileStore } from '../../store/userSettingsStore.js';

const Header = () => {
  const { toggleSidebar } = useSidebarStore();
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const {
    userProfile,
    fetchUserProfile,
    profileLoading,
    profileMessage,
  } = useUserProfileStore();

  useEffect(() => {
    // Fetch user profile on mount
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    // Update name and imageUrl when profile is fetched
    if (userProfile) {
      setName(userProfile.name || '');
      setImageUrl(userProfile.imageUrl || '');
    }
  }, [userProfile]);

  if (loading || profileLoading) {
    return <FullPageLoader />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/event/create')) return 'Create Event';
    if (path.startsWith('/event/edit')) return 'Edit Event';
    if (path.startsWith('/event')) return 'All Events';
    if (path.startsWith('/attendee')) return 'All Attendees';
    if (path.startsWith('/walkin')) return 'Walkin';
    if (path.startsWith('/email')) return 'Emails';
    if (path.startsWith('/walkin/walkin-form')) return 'Walkin Form';
    return 'Dashboard';
  };

  const getPageActions = () => {
    const path = location.pathname;
    if (path === '/') {
      return (
        <>
          <Link to="/event/create">
            <Button variant="primary" tone="primary">Create Event</Button>
          </Link>
          <Link to="/attendee">
            <Button variant="primary" tone="primary">View Attendee List</Button>
          </Link>
        </>
      );
    }

    if (path.startsWith('/event/create') || path.startsWith('/event/edit')) {
      return null;
    }

    if (path.startsWith('/event')) {
      return (
        <Link to="/event/create">
          <Button variant="primary" tone="primary">Create Event</Button>
        </Link>
      );
    }

    if (path.startsWith('/attendee')) {
      return (
        <>
          <Link to="/attendee">
            <ExportCSVButton />
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerAvatar}>
          <div className={styles.sidebarToggle} onClick={toggleSidebar}>
            <Icon source={MenuIcon} />
          </div>
          <div className={styles.headerAvatarInfo}>
            <div className={styles.headerAvatarIcon}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <Avatar size="large" name={name} />
              )}
            </div>
            <Text variant="bodyMd" fontWeight="medium">
              {name || 'User'}
            </Text>
          </div>
        </div>
        <div className={styles.headerBottom}>
          <Text variant="headingLg" as="h2" fontWeight="semibold">
            <div className={styles.headerBottomTitle}>
              {(location.pathname.startsWith('/event/create') ||
                location.pathname.startsWith('/event/edit') ||
                location.pathname.startsWith('/walkin/walkin-form')) && (
                  <div className={styles.backButton} onClick={() => {
                    if (location.pathname.startsWith('/walkin/walkin-form')) {
                      navigate('/walkin');
                    } else {
                      navigate('/event');
                    }
                  }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon source={ArrowLeftIcon} tone="base" />
                  </div>
                )}
              {getPageTitle()}
            </div>
          </Text>
          <div className={styles.headerBottomButtons}>
            {getPageActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
