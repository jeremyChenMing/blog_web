import React from 'react';
import l from './Single.less';
import { normalizeWheel } from '@/utils/common'
import BannerAnim, { Element } from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
const rdom = require('react-dom'); 
const BgElement = Element.BgElement;


let is_running = true;
let up_time;
let down_time;
let num = 0;
let down = 0;

let s = {};

s.mousewheel = {
  event: false,
  lastScrollTime: (new window.Date()).getTime()
};


class Demo extends React.Component {

  state = {
    page: 0
  }

  handleUp = () => {
    num++;
    if (num === 1) this.banner.next();
  }
  handleDown = () => {
    down++;
    if (down === 1) this.banner.prev();
  }
  scrollFunc = (e) => {
    
    const ele = rdom.findDOMNode(this);
    const data = normalizeWheel(e);
    let delta = -0;

    if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = data.pixelY;
    // console.log(delta)
    if (delta === 0) return;
    if (delta < 0) {
      console.log('up')
      this.handleUp()
      if (up_time) {
        clearTimeout(up_time)
      }
      up_time = setTimeout(function () {
        console.log('up---结束', is_running)
        num = 0
      }, 50)
    }else{
      console.log('down')
      this.handleDown()
      if (down_time) {
        clearTimeout(down_time)
      }
      down_time = setTimeout(function () {
        console.log('down---结束')
        down = 0;
      }, 50)
    }
  }
  handle = (type) => {
    // console.log(num, 'handle')
    // if (type === 'up') {
    //   num++;
    // }else{
    //   down++
    // }
    num++
    // console.log(num, down)
    if (type === 'up' && num === 1) {
      console.log('向下')
      this.banner.next()
      // this.banner.slickGoTo(++num)
    }else if (type === 'down' && num === 1) {
      console.log('向上', this.banner)
      this.banner.prev()
      // is_running = false;
      // setTimeout(this.banner.next, 500)
    }
  }
  changeBanner = (key) => {
    // console.log(key)
    if (key === 'after') {
      // is_running = true
      // setTimeout(function () {
      //   is_running = true
      // },100)
    }
  }
  render() {
    return (
      <BannerAnim 
        dragPlay={false}
        initShow={num}
        onWheel={this.scrollFunc} 
        prefixCls="banner-user" 
        ref={(c) => { this.banner = c; }}
        type="verticalOverlay"
        onChange={this.changeBanner}
      >
        
        <Element prefixCls="banner-user-elem" key="0">
          <BgElement
            key="bg"
            className="bg"
            style={{ background: '#364D79' }}
          />
          <TweenOne className="banner-user-title" 
            animation={{ 
              // y: -30,
              scale: .5, 
              top: -50,
              opacity: 0, 
              type: 'from' ,
              duration: 1000,
              repeat: -1,
              repeatDelay: 2000
            }}
          >
            1、PRODUCT
          </TweenOne>
          <TweenOne className="banner-user-title" 
            animation={{ 
              y: 20, 
              opacity: 0.5, 
              type: 'from', 
              delay: 400 
            }}
          >
            ------ 产品 ------
          </TweenOne>
          <QueueAnim 
            className={l.box} 
            key="box" 
            duration="500"  
            interval="400"
            animConfig={[
              { opacity: [1, 0], translateY: [0, 50] },
              // { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {
              ['','','','','','','',''].map( (item,index) => {
                return <div className={l.cell} key={`box${index}`}>{index + 1}</div>
              })
            }
          </QueueAnim>
        </Element>


        <Element prefixCls="banner-user-elem" key="1">
          <BgElement
            key="bg"
            className="bg"
            style={{ background: '#64CBCC'}}
          />
          <TweenOne className="banner-user-title"
            animation={{ 
              // y: -30,
              scale: .5, 
              top: -50,
              opacity: 0, 
              type: 'from' ,
              duration: 1000,
              // repeat: -1,
              repeatDelay: 2000
            }}
          >
            2、Ant Motion Banner
          </TweenOne>
          <TweenOne
            className="banner-user-text"
            animation={{ 
              y: 20, 
              opacity: 0.5, 
              type: 'from', 
              delay: 400 
            }}
          >
            The Fast Way Use Animation In React 111111
          </TweenOne>
          <QueueAnim 
            className={l.box1} 
            key="box" 
            duration="1500"  
            interval="200"
            animConfig={[
              { opacity: [1, 0], scale: [1, 0] },
              // { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {
              ['','','','','','','','', ''].map( (item,index) => {
                return <div className={l.cell1} key={`box${index}`}>{index + 1}</div>
              })
            }
          </QueueAnim>
        </Element>



        <Element prefixCls="banner-user-elem" key="2">
          <BgElement
            key="bg"
            className="bg"
            style={{ background: '#ccf'}}
          />
          <TweenOne className="banner-user-title"
            animation={{ 
              // y: -30,
              scale: .5, 
              top: -50,
              opacity: 0, 
              type: 'from' ,
              duration: 1000,
              // repeat: -1,
              repeatDelay: 2000
            }}
          >
            3、Jeremy chen Ming
          </TweenOne>
          <TweenOne
            className="banner-user-text"
            animation={{ 
              y: 20, 
              opacity: 0.5, 
              type: 'from', 
              delay: 400 
            }}
          >
            hello world
          </TweenOne>
          <QueueAnim 
            className={l.box1} 
            key="box" 
            duration="1500"  
            interval="200"
            animConfig={[
              { opacity: [1, 0], scale: [1, 0] },
              // { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            <div className={l.cell2} key={`cell1`}>box</div>
          </QueueAnim>
        </Element>
      </BannerAnim>
    );
  }
}
export default Demo;
