import { Outlet } from 'react-router-dom';
import AIAssistant from '../components/common/AIAssistant';

const MainLayout: React.FC = () => {
    return (
        <>
            <AIAssistant />
            <Outlet />
        </>
    );
};

export default MainLayout;
