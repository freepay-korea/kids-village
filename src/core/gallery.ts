/**
 * 미술관 갤러리 저장소 (IndexedDB).
 * 그림은 래스터가 아니라 "어느 칸에 어떤 색을 칠했는지 + 스탬프 위치"만 저장하고 다시 그린다.
 * 기기 안에만 저장되며 서버로 보내지 않는다.
 */
export interface Stamp {
  x: number
  y: number
  emoji: string
}

export interface Artwork {
  id?: number
  createdAt: number
  pictureId: string
  fills: Record<string, string>
  stamps: Stamp[]
}

const DB = 'kids-village'
const STORE = 'artworks'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = run(t.objectStore(STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
        t.oncomplete = () => db.close()
      }),
  )
}

export const gallery = {
  save: (art: Omit<Artwork, 'id'>) => tx<IDBValidKey>('readwrite', (s) => s.add(art)),
  list: () =>
    tx<Artwork[]>('readonly', (s) => s.getAll()).then((list) => list.sort((a, b) => b.createdAt - a.createdAt)),
  remove: (id: number) => tx<undefined>('readwrite', (s) => s.delete(id)),
  clear: () => tx<undefined>('readwrite', (s) => s.clear()),
}
