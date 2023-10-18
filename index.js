```js
"use client"

import { useEffect, useState } from "react"

const useRoomData = (queryString) => {
  const [roomsData, setRoomsData] = useState([])
  const [payloadData, setPayloadData] = useState([])
  const [totalAdults, setTotalAdults] = useState(0)
  const [totalChildren, setTotalChildren] = useState(0)
  const [totalPassengers, setTotalPassengers] = useState(0)
  const [totalRooms, setTotalRooms] = useState(0)
  const [roomSummary, setRoomSummary] = useState("")

  useEffect(() => {
    // URL'den aldığı rooms değerini array'e çevirir
    const getParseRooms = (rooms) => {
      const roomArray = rooms.split(",")

      return roomArray.map((room) => {
        const [adults, ...childrenAges] = room.split("-")

        return {
          adults: parseInt(adults, 10),
          children: childrenAges.length,
          childAges: childrenAges.map((age) => parseInt(age, 10)),
        }
      })
    }

    // Backend'e gidecek payload datasını hesaplar
    const getGeneratePayloadData = (roomsData) => {
      return roomsData.map((room) => {
        const passengers = []

        for (let i = 0; i < room.adults; i++) {
          passengers.push({
            passengerType: "Adult",
          })
        }

        for (let i = 0; i < room.childAges.length; i++) {
          passengers.push({
            passengerType: "Child",
            age: room.childAges[i],
          })
        }

        return {
          passengers,
        }
      })
    }

    const roomsQuery = queryString.slice(queryString.indexOf("=") + 1)
    const parsedRoomsData = getParseRooms(roomsQuery)
    const generatePayloadData = getGeneratePayloadData(parsedRoomsData)

    setTotalRooms(parsedRoomsData.length)
    setRoomsData(parsedRoomsData)
    setPayloadData(generatePayloadData)
  }, [queryString])

  useEffect(() => {
    setRoomSummary(`${totalRooms} oda, ${totalPassengers} misafir`)
  }, [totalRooms, totalPassengers])

  useEffect(() => {
    // toplam yetişkin sayısını hesaplar
    const calculateTotalAdults = (roomsData) => {
      return roomsData.reduce((totalAdults, room) => {
        return totalAdults + room.adults
      }, 0)
    }

    // toplam çocuk sayısını hesaplar
    const calculateTotalChildren = (roomsData) => {
      return roomsData.reduce((totalChildren, room) => {
        return totalChildren + room.children
      }, 0)
    }

    // toplam misafir sayısını hesaplar
    const calculateTotalPassengers = (roomsData) => {
      const totalAdults = calculateTotalAdults(roomsData)
      const totalChildren = calculateTotalChildren(roomsData)

      return totalAdults + totalChildren
    }

    setTotalAdults(calculateTotalAdults(roomsData))
    setTotalChildren(calculateTotalChildren(roomsData))
    setTotalPassengers(calculateTotalPassengers(roomsData))
  }, [roomsData])

  return [
    roomsData,
    payloadData,
    totalAdults,
    totalChildren,
    totalPassengers,
    totalRooms,
    roomSummary,
  ]
}

export default useRoomData

```
