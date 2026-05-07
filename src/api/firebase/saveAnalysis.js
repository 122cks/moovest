import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import { db } from './config'

export const saveRankingToFirebase = async (market, top5Data) => {
  const analysesRef = collection(db, 'stockAnalyses')

  // 마지막 회차(episode) 번호 가져오기
  const q = query(analysesRef, orderBy('episode', 'desc'), limit(1))
  const querySnapshot = await getDocs(q)
  let nextEpisode = 1
  if (!querySnapshot.empty) {
    nextEpisode = querySnapshot.docs[0].data().episode + 1
  }

  // 새 데이터 저장
  const docRef = await addDoc(analysesRef, {
    episode: nextEpisode,
    market: market,
    createdAt: serverTimestamp(),
    top5: top5Data,
  })

  console.log('기록 저장 완료! 문서 ID:', docRef.id)
  return nextEpisode
}
