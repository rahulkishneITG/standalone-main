import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text, Page, Card, LegacyStack } from '@shopify/polaris';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.name) {
            toast.success(`Welcome, ${user.name}!`);
        }
    }, [user]);

    const handleLogout = useCallback(async (e) => {
        e.preventDefault();
        await logout();
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    }, [logout, navigate]);

    return (
        <Page title="Dashboard">
            <Card sectioned>
                <LegacyStack vertical>
                    <Text variant="headingLg" as="h2">
                        Welcome to Your Dashboard
                    </Text>
                    <Button onClick={handleLogout}>Logout</Button>
                </LegacyStack>
            </Card>
        </Page>
    );
}