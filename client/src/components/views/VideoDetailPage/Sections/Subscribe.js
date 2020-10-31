import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

  const [SubscriberNumber, setSubscriberNumber] = useState(0)
  const [Subscribed, setSubscribed] = useState(false)

  useEffect(() => {

    // 구독자 수 불러오기 
    let variable = { userTo: props.userTo }

    Axios.post('/api/subscribe/subscribeNumber', variable)
      .then(response => {
        if (response.data.success) {
          setSubscriberNumber(response.data.subscribeNumber)
        } else {
          alert('구독자 수 정보를 받아오지 못했습니다.')
        }
      })

    // 구독하는지 여부 
    // 웹 localstorage 에서 가져옴
    let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

    Axios.post('/api/subscribe/subscribed', subscribedVariable)
      .then(response => {
        if (response.data.success) {
          setSubscribed(response.data.subscribed)
        } else {
          alert('정보를 받아오지 못했습니다.')
        }
      })


  }, [])


  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribe ? '#CC0000' : '#AAAAAA'}`, borderRadius: '4px',
          color: 'white', padding: '10px 16px',
          fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
        }}
        onClick
      >
        {SubscriberNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </div>
  )
}

export default Subscribe