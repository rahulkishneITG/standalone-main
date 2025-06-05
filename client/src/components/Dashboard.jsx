import { useCallback, useContext, useEffect,useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text, Page, Card, LegacyStack } from '@shopify/polaris';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';


export default function Dashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const hasShownWelcome = useRef(false);
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const userData = localStorage.getItem('user');
        setUserData(JSON.parse(userData));
        if (userData && !hasShownWelcome.current) {
            hasShownWelcome.current = true;
            toast.success(`Welcome back, ${JSON.parse(userData).name || 'User'}!`);
        }
       
    }, [user]);

    const handleLogout = useCallback(async (e) => {
        e.preventDefault();
        
            await logout();
            toast.success('Logout successful! ');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
   
    }, [logout, navigate]);
    return (
        <Page title="Dashboard">
            <Card sectioned>
                <LegacyStack vertical>
                    <Text variant="headingLg" as="h2">
                        Welcome to Your Dashboard {userData?.name ? `, ${userData.name}` : 'Guest'}!
                    </Text>
                    <Button onClick={handleLogout}>Logout</Button>
                </LegacyStack>
            </Card>
        </Page>
    );
}