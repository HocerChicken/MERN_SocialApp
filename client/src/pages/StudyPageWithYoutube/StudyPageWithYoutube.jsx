import React from 'react'
import Logo from '../../img/logo.png'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import PlayButton from '../../components/PomoButton/PlayButton'
import PauseButton from '../../components/PomoButton/PauseButton'
import SettingsButton from '../../components/PomoButton/SettingsButton'
import ModalTimer from '../../components/PomoButton/ModalTimer'
import SettingsContext from '../../store/SettingsContext'
import { useState, useContext } from 'react'
import { useEffect, useRef } from 'react'
import Timer from '../../components/Timer/Timer'
import ModalChangeBackgound from '../../components/PomoButton/ModalChangeBackgound'
import StudyPageWithYoutubeBg from '../../components/StudyPageWithYoutubeBg/StudyPageWithYoutubeBg'
import { useLocation } from 'react-router-dom'

const red = '#f54e4e'
const green = '#4aec8c'

const StudyPageWithYoutube = () => {
  const location = useLocation()
  const embedLink = location.state?.embedLink
  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [bgColor, setBgColor] = useState('linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)')
  const [mode, setMode] = useState('work')
  const [isPaused, setIsPaused] = useState(true)
  const [isNoti, setIsNoti] = useState(false)
  const [onTimerEnd, setOnTimerEnd] = useState(() => () => { })

  return (
    <SettingsContext.Provider value={{
      workMinutes,
      breakMinutes,
      bgColor,
      setWorkMinutes,
      setBreakMinutes,
      isPaused,
      setIsPaused,
      isNoti,
      setIsNoti,
      setBgColor,
      mode,
      setMode,
      onTimerEnd,
      setOnTimerEnd,
    }} >
      <StudyPageWithYoutubeBg embedLink={embedLink} />
    </SettingsContext.Provider >

  )
}

export default StudyPageWithYoutube
