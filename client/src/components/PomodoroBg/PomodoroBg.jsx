import React from 'react'
import Logo from '../../img/logo.png'
import 'react-circular-progressbar/dist/styles.css'
import SettingsButton from '../../components/PomoButton/SettingsButton'
import ModalTimer from '../../components/PomoButton/ModalTimer'
import SettingsContext from '../../store/SettingsContext'
import { useState, useContext } from 'react'
import Timer from '../../components/Timer/Timer'
import ModalChangeBackgound from '../../components/PomoButton/ModalChangeBackgound'
import './PomodoroBg.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MusicPlayer from '../../components/PomoButton/MusicPlayer'
import LeftSideBar from './../LeftSideBar/LeftSideBar'
const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER

function PomodoroBg() {
  const settingsInfo = useContext(SettingsContext)
  const { user } = useSelector((state) => state.authReducer.authData)
  console.log('>>>> user', user)

  const style = {
    background: settingsInfo.bgColor,
  }

  return (
    <div className="z-50 -m-4 min-h-screen flex flex-col h-screen bg-gradient-to-r from-blue-500" style={style}>
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-transparent p-2 ">
        <div className="w-auto h-9 relative ml-5 flex items-center space-x-5">
          <img className="h-full" src={Logo} alt="Logo" />
          <span className="text-lg">Hi, {user.firstname + ' ' + user.lastname}</span>
        </div>
        <div>
          <img
            className="w-11 h-11 bg-gray-500 rounded-full mx-4"
            src={user.profilePicture ? serverPublic + user.profilePicture : serverPublic + 'defaultProfile.jpg'}
            alt=""
          />
        </div>
      </div>
      {/* <!-- Main Content --> */}
      <div className="flex-1 flex">
        {/* sidebar */}
        <LeftSideBar />
        <div className="flex-1 p-4 relative">
          {/* <!-- Main Section --> */}
          <div className="fixed top-28 left-1/2 transform -translate-x-1/2 w-auto h-auto items-center space-x-4">
            {/* <!-- Timers Section --> */}
            <Timer />
          </div>
          {/* <!-- Bottom Section --> */}
          <div className="absolute w-full bottom-20 left-1/2 transform -translate-x-1/2 bg-transparent ">
            <MusicPlayer />
          </div>
        </div>
        {/* Right bar */}
        <div className="w-[56px] mr-5 bg-transparent flex flex-col items-center py-4 space-y-4 ">
          <div className="bg-gray-900 p-3 space-y-4 rounded-lg">
            <ModalTimer />
            <ModalChangeBackgound />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroBg