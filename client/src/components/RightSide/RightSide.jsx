import React, { useState } from 'react'
import './RightSide.scss'
import Home from '../../img/home.png'
import Noti from '../../img/noti.png'
import Comment from '../../img/comment.png'
import { UilSetting } from '@iconscout/react-unicons'
import TrendCard from '../TrendCard/TrendCard'
import ShareModal from '../ShareModal/ShareModal'
import { Link } from 'react-router-dom'

const RightSide = () => {
  const [modalOpened, setmodalOpened] = useState(false)

  return (
    <div className="RightSide">
      <div className="navIcons">
        <Link to="/home">
          <img src={Home} alt="" />
        </Link>
        <UilSetting />
        <img src={Noti} alt="" />
        <Link to="/chat">
          <img src={Comment} alt="" />
        </Link>
      </div>
      <TrendCard />

      <button
        className="button right-button"
        onClick={() => setmodalOpened(true)}
      >
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setmodalOpened} />
    </div>
  )
}

export default RightSide
