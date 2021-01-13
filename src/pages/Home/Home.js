import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { LoginContext } from '../../context/LoginContext';
import ListUser from '../../components/ListUser/ListUser';
import ManageListGameCard from './ManagerListHomeCard/ManagerListHomeCard';
import callAuthAPI from '../../utils/CallAuthAPI';
import './styles.css';
import Header from './../../components/Header/Header'

const Home = () => {
	const [login, setLogin] = useState({
		state: false,
		isLogin: false
	});
	const [isLogin] = useContext(LoginContext);
	useEffect(() => {
		callAuthAPI('auth/profile', 'GET', {
		}, JSON.parse(localStorage.getItem('id_token')))
			.then(res => {
				setLogin({
					state: true,
					isLogin: true,
				})
			})
			.catch((err) => setLogin({
				state: true,
				isLogin: false,
			}))
	}, [isLogin]);

	if (login.state) if (!login.isLogin) return <Redirect to='/login' />
	return (
		<>
			<Header />
			<Container fluid className='homeContainer'>
				{
					login.isLogin ? (
						<>
							<div className='listGameContainer'>
								<ManageListGameCard />
							</div>
							<div className='listOnlineContainer'>
								<ListUser />
							</div>
						</>)
						: null
				}

			</Container>
		</>
	)
}
export default Home;