import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from './config'

export const getRankingHistory = async () => {
  try {
    const q = query(collection(db, 'stockAnalyses'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('히스토리 불러오기 에러:', error)
    return []
  }
}
