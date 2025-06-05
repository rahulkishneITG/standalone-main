import { useCallback, useContext, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text, Page, Card, LegacyStack } from '@shopify/polaris';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';


export default function Dashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const hasShownWelcome = useRef(false);


    useEffect(() => {
        if (user?.name && !hasShownWelcome.current) {
            toast.success(`Welcome, ${user.name}!`);
            hasShownWelcome.current = true;
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
                        Welcome to Your Dashboard {user?.name ? `, ${user.name}` : ''}!
                    </Text>
                    <Button onClick={handleLogout}>Logout</Button>
                </LegacyStack>
            </Card>
        </Page>
    );
}