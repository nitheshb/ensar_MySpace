import {
    setDoc,
    doc,
    orderBy,
    addDoc,
    // getFirestore,
    onSnapshot,
    collection,
    getDoc,
    getDocs,
    query,
    where,
    Timestamp,
    increment,
    updateDoc,
    deleteDoc,
    limit,
    arrayUnion,
    deleteField,
    DocumentData,
    FirestoreError,
    QuerySnapshot,
    SnapshotListenOptions,
  } from 'firebase/firestore'
import { DB } from 'src/auth/context/firebase/auth-provider'


export const getAssetsByAdminStatus = (orgId: any, snapshot: any, data: { status: any }, error: any) => {
    const { status } = data
    const itemsQuery = query(
      collection(DB, `${orgId}_assets`),
    )
    console.log('hello by Status', onSnapshot(itemsQuery, snapshot, error))
    return onSnapshot(itemsQuery, snapshot, error)
  }
  
export const getEmpByStatus = (orgId: any, snapshot: any, data: { status: any }, error: any) => {
    const { status } = data
    const itemsQuery = query(
      collection(DB, `${orgId}_emp`),
    )
    console.log('hello by Status', onSnapshot(itemsQuery, snapshot, error))
    return onSnapshot(itemsQuery, snapshot, error)
  }


export const addEmployee = async (orgId:any, data:any, by:any) => {
  try {
    delete data['']
    const x = await addDoc(collection(DB, `${orgId}_emp`), data)
    await console.log('add Lead value is ', x, x.id, data)
    const { intype, Name, Mobile, assignedTo, Project, assignedToObj } = data
    const z =  {
      type: 'emp_ctd',
      subtype: intype,
      T: Timestamp.now().toMillis(),
      Luid: x?.id || '',
      by,
      payload: {},
    }
    const y = await addDoc(collection(DB, `${orgId}_emp_logs`), z)

  }catch(error){
    console.log('error', error)
  }

}  