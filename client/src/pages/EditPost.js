import '../stylesheet/CreatePost.css'
import React, { useState, useEffect, history } from 'react'
import { useHistory, withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Map from '../components/Map'
import { setPost } from '../redux/action'
import DaumAddress from '../components/DaumAddress'
const { kakao } = window
function EditPost ({ post, userinfo }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const [getSearch, getSetsearch] = useState(false)
  const [getTitle, getSetTitle] = useState(post.title)
  const [getFileImage, getSetFileImage] = useState('')
  const [getText, getSetText] = useState(post.text)
  // const [getLocation, getSetLocation] = useState(post.loaction)
  const [getLatitude, getSetLatitude] = useState(post.latitude)
  const [getLongitude, getSetLongitude] = useState(post.longitude)
  const [getDetailAddress, getSetDetailAddress] = useState(post.location)

  const searchAddress = (a) => {
    getSetDetailAddress(a)
  }
  const onTitleHandle = (e) => {
    getSetTitle(e.target.value)
  }
  const onTextHandle = (e) => {
    getSetText(e.target.value)
  }
  const onFileImageHandle = (e) => {
    getSetFileImage(e.target.files[0])
  }

  const onsearchAddressHandle = () => {
    getSetsearch(true)
  }
  const onClosesearchHandle = () => {
    getSetsearch(false)
  }
  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder()

    if (getDetailAddress === '') {
      return
    }
    geocoder.addressSearch(getDetailAddress, function (results, status) {
      if (status === kakao.maps.services.Status.OK) {
        const result = results[0]
        getSetLatitude(Number(result.y))
        getSetLongitude(Number(result.x))
      }
    })
  }, [getDetailAddress])

  const editPost = () => {
    const formData = new FormData()
    formData.append('title', getTitle)
    formData.append('text', getText)
    formData.append('latitude', getLatitude)
    formData.append('longitude', getLongitude)
    formData.append('postimage', getFileImage)
    formData.append('location', getDetailAddress)
    if (
      getTitle === '' || getText === ''
    ) {
      alert('????????? ??????????????? .')
    } else if (getDetailAddress === '') {
      alert('????????? ???????????????.')
    } else {
      axios.patch(`${process.env.REACT_APP_API_URL}/posts/${post.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`,
          'Content-Type': 'multipart/form-data'

        }
      })
        .then((data) => {
          dispatch(setPost(data.data.data))
          history.goBack()
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <>

      <div className='create_container'>

        <form className='create_form'>
          <div className='create_title'>
            <span>??????</span>
            <input type='text' name='title' placeholder='????????? ???????????????' value={getTitle} onChange={onTitleHandle} />
          </div>
          <div className='create_checkbox'>
            <span>??????</span>
            <input
              type='file'
              accept='img/*'
              name='postimage'
              onChange={onFileImageHandle}
            />
          </div>
          <div className='create_main_text'>
            <span>??????</span>
            <textarea placeholder='????????? ???????????????' defaultValue={post.text} name='text' value={getText} onChange={onTextHandle} />
          </div>
          <div className='create_map'>
            <span>??????</span>
            <div className={getSearch ? 'search_on' : 'search_on off'}>
              <DaumAddress searchAddress={searchAddress} onClosesearchHandle={onClosesearchHandle} />
            </div>

            <div className='create_serch_container'>
              <div
              type='button'
              className='create_main_search_btn'
              value='?????? ??????'
              onClick={onsearchAddressHandle}
            >???????????? ??????
            </div>
              <div className='getDetail_adress'>{`${getDetailAddress}`}</div>
            </div>
            <Map getLatitude={getLatitude} getLongitude={getLongitude} />

          </div>
          <div className='create_button_container'>
            <div type='button' className='create_button' onClick={editPost}>????????? ??????</div>
          </div>
        </form>

      </div>
    </>
  )
}

export default EditPost
