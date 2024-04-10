import { useNavigate } from 'react-router-dom';

const NoPage = () => {
	const navigate = useNavigate();
	return (
        <div>
            <p>No Page Found</p>
        </div>
    );
};

export default NoPage;