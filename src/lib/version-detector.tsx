import * as React from 'react'
import { Modal } from 'infrad'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { useState, useEffect } from 'react'
import 'infrad/dist/antd.css'
import { ajax } from 'rxjs/ajax'
import { catchError, interval as rxjsInterval, NEVER, switchMap} from 'rxjs'

interface IVersionDetectorProps {
  localVersion: string
  cancelable?: boolean
  url?: string
  interval?: number
}

function getVersionApi(url: string) {
  return ajax.getJSON<{
    version: string
  }>(url, {
    'cache-control': 'no-cache'
  })
}

export function VersionDetector({
  localVersion,
  cancelable = false,
  url = '/version.json',
  interval = 60
}: IVersionDetectorProps) {
  const [detected, setDetected] = useState(false)
  useEffect(() => {
    if (!detected) {
      const s = rxjsInterval(interval * 1000).pipe(switchMap(() => {
        return getVersionApi(url).pipe(catchError((e) => {
          console.error(e)
          return NEVER
        }))
      })).subscribe(res => {
        const remoteVersion = res.version
        if (localVersion !== remoteVersion) {
          const content = 'Detect a new version, please refresh window.'
          const onOk = () => window.location.reload()
          if (cancelable) {
            Modal.confirm({
              icon: <ExclamationCircleOutlined />,
              content,
              onOk
            })
          } else {
            Modal.warn({
              content,
              onOk
            })
          }
          setDetected(true)
        }
      })
      return () => s.unsubscribe()
    }
  }, [cancelable, detected, interval, localVersion, url])
  return null
}

export default VersionDetector
