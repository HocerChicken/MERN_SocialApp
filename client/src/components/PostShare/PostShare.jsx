import {
  UilLocationPoint,
  UilPlayCircle,
  UilScenery,
  UilSchedule,
  UilTimes,
} from '@iconscout/react-unicons'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadImage, uploadPost } from '../../actions/uploadAction'
import './PostShare.scss'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const PostShare = () => {
  const loading = useSelector((state) => state.postReducer.uploading)
  const [image, setImage] = useState(null)
  const imageRef = useRef()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData)
  const desc = useRef()
  const { t } = useTranslation(['profile'])
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0]
      setImage(img)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const descCheck = desc.current.value.trim()

    if (!descCheck) {
      toast.error('Please enter a description before posting.')
      return
    }
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    }

    if (image) {
      const data = new FormData()
      const filename = Date.now() + image.name

      data.append('name', filename)
      data.append('file', image)
      newPost.image = filename
      try {
        dispatch(uploadImage(data))
      } catch (error) {
        console.log(error)
      }
      reset()
    }
    try {
      dispatch(uploadPost(newPost))
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  const reset = () => {
    setImage(null)
    desc.current.value = ''
  }
  return (
    <div className="PostShare">
      <img
        src={
          user.profilePicture
            ? serverPublic + user.profilePicture
            : serverPublic + 'defaultProfile.jpg'
        }
        alt=""
      />
      <div>
        <input
          ref={desc}
          type="text"
          placeholder={t('share')}
          required
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: 'var(--photo)' }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option " style={{ color: 'var(--video)' }}>
            <UilPlayCircle />
            Video
          </div>
          <div className="option" style={{ color: 'var(--location)' }}>
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: 'var(--shedule)' }}>
            <UilSchedule />
            Schedule
          </div>
          <button
            className="button post-share-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Posting...' : t('share button')}
          </button>
        </div>
        <div style={{ display: 'none' }}>
          <input
            type="file"
            name="myImage"
            ref={imageRef}
            onChange={onImageChange}
          />
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img
              src={URL.createObjectURL(image)}
              alt=""
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PostShare
