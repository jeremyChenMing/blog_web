import React from 'react';
import l from './Game.less';
import cx from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Modal } from 'antd';
import { createGameRecord, getGameOfList } from '@/services/api';
import { AVATAR, DEFAULT } from '@/constants/Constants';

@connect(({ loading }) => ({
	submitting: loading.effects['blog/detail'],
}))
class CarGame extends React.Component {
	state = {
		gameState: 0,
		gameStart: 0,
		heroLoc: 0,
		enemyLoc: 0,
		enemyType: 0,
		enemySpeed: 0,
		gameOver: 0,
		chunge: 0,

		superMode: 0,
		hasSuper: 0,

		aniEnd: true,
		kilometer: 0,
		user: false,

		games: [],
	};

	getGame = async () => {
		try {
			const result = await getGameOfList({ page: 1, page_size: 10 });
			if (result && !result.code) {
				console.log(result);
				this.setState({
					games: result.items,
				});
			}
		} catch (err) {
			console.log(err);
		}
	};
	componentDidMount() {
		const message = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : {};
		window.addEventListener('keydown', this.gameHandle, false);
		this.setState(
			{
				user: message.id,
			},
			this.getGame
		);
		if (!message.id) {
			// 有登录人
			Modal.confirm({
				title: '游戏提示信息',
				okText: '确认',
				cancelText: '取消',
				content: (
					<div>
						<p>将以游客身份进行游戏！</p>
					</div>
				),
				onOk() {},
				onCancel() {
					router.push('/login');
				},
			});
		}
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.gameHandle, false);
		this.setState({
			user: false,
		});
	}

	gameHandle = e => {
		if (this.state.gameState !== 1) {
			return;
		}
		switch (e.keyCode) {
			case 37:
				this.setState({ heroLoc: 0 });
				break;
			case 39:
				this.setState({ heroLoc: 1 });
				break;
			case 32:
				if (this.state.hasSuper === 1) {
					this.setState({
						superMode: 1,
						hasSuper: 0,
					});
				}
				break;
			default:
				break;
		}
	};
	gameStarts = () => {
		this.setState(
			{
				gameState: 1,
				gameStart: 1,
				kilometer: 0,
				heroLoc: 0,
				enemyLoc: 0,
				enemyType: 0,
				enemySpeed: 0,
				gameOver: 0,
				superMode: 0,
				hasSuper: 0,
				chunge: 0,
				aniEnd: true,
			},
			() => {
				this.createEnemy();
				this.gameTick(true);
			}
		);
	};
	gameRestart = () => {
		this.gameStarts();
	};
	createEnemy = () => {
		const that = this;

		var enemyLoc, enemyType, enemySpeed;
		this.enemyTime = setInterval(function() {
			if (that.state.aniEnd && that.state.gameState === 1) {
				that.setState({ aniEnd: false });
				enemyType = Math.floor(Math.random() * 3);
				enemyLoc = Math.round(Math.random());
				enemySpeed = Math.floor(Math.random() * 3);
				that.setState({
					enemyLoc,
					enemyType,
					enemySpeed,
				});
				if (that.refs.enemy) {
					that.refs.enemy.addEventListener('webkitAnimationEnd', function() {
						that.setState({ aniEnd: true });
					});
				}
			}
		}, 1000);
	};

	gameTick = bool => {
		const that = this;
		let crash = 620,
			dis = 0;
		let kilometer = JSON.parse(JSON.stringify(this.state.kilometer));
		if (bool) {
			this.Tick = setInterval(function() {
				if (that.refs.enemy) {
					const str = window.getComputedStyle(that.refs.enemy, null).getPropertyValue('transform');
					dis = str.split(',')[5].replace(')', '');
					if (dis > crash && dis < crash + 220 && that.state.heroLoc === that.state.enemyLoc) {
						if (that.state.superMode === 1) {
							that.superBuff();
						} else {
							that.gameOver();
						}
					}
				}
				if (that.state.superMode === 1) {
					// console.log('超级增加')
					kilometer += 5;
				} else {
					kilometer++;
				}
				// console.log(kilometer);
				that.setState({
					kilometer: kilometer,
				});
				if (kilometer % 1000 === 0) {
					// console.log('kilometer % 100');
					that.superMode();
				}
			}, 10);
		} else {
			clearInterval(this.Tick);
		}
	};
	superMode = () => {
		const that = this;
		this.setState({
			hasSuper: 1,
		});
		setTimeout(function() {
			that.setState({ superMode: 0 });
		}, 3000);
	};
	superBuff = () => {
		const that = this;
		this.setState({
			chunge: 1,
		});
		setTimeout(function() {
			that.setState({ chunge: 0 });
		}, 1000);
	};

	gameOver = () => {
		const { user } = this.state;
		// console.log(this.state.kilometer / 100, '结束了');
		this.setState(
			{
				gameState: 0,
				gameOver: 1,
			},
			() => {
				if (user) {
					this.handleAjax({
						user_id: user,
						kilometer: (this.state.kilometer / 100) | 0,
					});
				}
				this.gameTick(false);
				clearInterval(this.enemyTime);
			}
		);
	};

	handleAjax = async para => {
		try {
			const result = createGameRecord(para);
			if (result && !result.code) {
				this.getGame();
			}
		} catch (err) {
			console.log(err);
		}
	};

	goback = () => {
		router.goBack();
	};
	render() {
		const {
			gameStart,
			gameState,
			heroLoc,
			kilometer,
			gameOver,
			superMode,
			chunge,
			hasSuper,
			games,
		} = this.state;
		let cls = '';
		if (gameOver === 1) {
			cls = 'crashed';
		} else if (superMode === 1) {
			cls = 'superMode';
		}
		return (
			<div className={l.gameBox}>
				<div className={l.btn}>
					<img
						className={l.back}
						onClick={this.goback}
						src="/img/ic_order_back@2x.png"
						alt="back"
					/>
					<Button className={l.over} type="primary" onClick={this.gameOver}>
						结束游戏
					</Button>
				</div>
				<div className={l.record}>
					<h2>排行榜</h2>
					<ul className={l.list}>
						{games.map((item, index) => {
							return (
								<li className={l[`color${index}`]} key={index}>
									<span>{`${index + 1}`}</span>
									<img
										src={item.user && item.user.avatar ? `${AVATAR}${item.user.avatar}` : DEFAULT}
										alt="头像"
									/>
									<div className={l.name}>{item.user ? item.user.nickname : ''}</div>
									<div className={l.unit}>{item.kilometer ? item.kilometer : 0}km</div>
								</li>
							);
						})}
					</ul>
				</div>

				<div className={cx(l.board, l[cls])}>
					<div className={cx(l.roadbed, l[gameStart === 0 ? '' : 'roadRun'])} />
					<div className={cx(l.road, l[gameStart === 0 ? '' : 'roadPlay'])}>
						<div className={cx(l.hero, l[heroLoc === 0 ? 'left' : 'right'])}>
							<div className={cx(l.body)} />
							<span className={cx(l.light)} />
						</div>
						{this.state.aniEnd ? null : (
							<div
								ref="enemy"
								className={cx(
									l.enemy,
									l[gameStart === 0 ? '' : 'enemy' + this.state.enemyType],
									l[gameState === 0 ? '' : 'loc' + this.state.enemyLoc],
									l[gameState === 0 ? '' : 'speed' + this.state.enemySpeed]
								)}
							>
								<div className={cx(l.body, l[chunge === 1 ? 'chunge' : ''])} />
							</div>
						)}
						<p className={l.help}>方向键←→控制左右</p>
						<p className={cx(l.helpsp, l[hasSuper === 1 ? 'show' : ''])}>空格键开启春哥模式！</p>
					</div>
					<span
						onClick={this.gameStarts}
						className={cx(l.start, l[gameStart === 0 ? '' : 'hide'])}
					/>
					<span className={cx(l.kilo)}>{parseInt(kilometer / 100)}</span>
					<div className={cx(l.failbub)}>
						<span className={cx(l.failtext)} />
						<span className={cx(l.retry)} onClick={this.gameRestart} />
					</div>
				</div>
			</div>
		);
	}
}

export default CarGame;
