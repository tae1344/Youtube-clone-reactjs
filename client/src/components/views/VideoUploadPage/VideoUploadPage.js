import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import DropZone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';



const { TextArea } = Input;
const { Title } = Typography;


const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" }
]

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
]

function VideoUploadPage(props) {
  const user = useSelector(state => state.user); // 리덕스 state에서 정보를 가져옴
  // state 설정
  const [VideoTitle, setVideoTitle] = useState("")
  const [Description, setDescription] = useState("")
  const [Private, setPrivate] = useState(0)    // Private -> 0, Public -> 1
  const [Category, setCategory] = useState("Film & Animation") // 초기값
  const [FilePath, setFilePath] = useState("")
  const [Duration, setDuration] = useState("")
  const [ThumbnailPath, setThumbnailPath] = useState("")

  // 이벤트 설정
  const onTitleChange = (e) => {
    //console.log(e.currentTarget)
    // state를 바꾸려면 set~~된것을 바꾸면 된다.
    setVideoTitle(e.currentTarget.value)
  }

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value)
  }

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value)
  }

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value)
  }

  const onDrop = (files) => {

    let formData = new FormData;
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }
    formData.append("file", files[0])

    Axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
        if (response.data.success) {
          console.log(response.data)

          let variable = {
            url: response.data.url,
            fileName: response.data.fileName
          }

          setFilePath(response.data.url)

          Axios.post('/api/video/thumbnail', variable)
            .then(response => {
              if (response.data.success) {
                //console.log(response.data)
                setDuration(response.data.fileDuration)
                setThumbnailPath(response.data.url)
              } else {

                alert('썸네일 생성에 실패했습니다.')
              }
            })


        } else {
          console.log(response.data)
          alert('비디오 업로드를 실패했습니다.')
        }
      })

  }

  const onSubmit = (e) => {
    e.preventDefault(); //기본 이벤트 성질 방지

    // 리덕스를 이용해 정보를 가져옴
    const variable = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath
    }


    Axios.post('/api/video/uploadVideo', variable)
      .then(response => {
        if (response.data.success) {
          //console.log(response.data)
          message.success('성공적으로 업로드를 했습니다.')

          setTimeout(() => {
            props.history.push('/')
          }, 3000);

        } else {
          alert('비디오 업로드에 실패했습니다.')
        }
      })
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space_between' }}>
          {/* Drop zone */}
          <DropZone
            onDrop={onDrop}
            multiple={false}
            maxSize={8000000000}>
            {({ getRootProps, getInputProps }) => (
              <div style={{
                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}{...getRootProps()}>
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}

          </DropZone>
          {/* Thumbnail */}
          {/* ThumbnailPath가 있을때만 렌더링 하라는 문법 */}
          {ThumbnailPath &&
            <div>
              <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail" />
            </div>

          }

        </div>
        <br />
        <br />

        <label>Title</label>
        <Input
          onChange={onTitleChange}
          value={VideoTitle}
        />

        <br />
        <br />
        <label>Description</label>
        <TextArea
          onChange={onDescriptionChange}
          value={Description}
        />

        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option> // map을 쓰면 항상 key가 있어야 에러가 안뜸
          ))}
        </select>

        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}

        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default VideoUploadPage
