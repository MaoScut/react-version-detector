import * as React from 'react'
import { Modal } from 'infrad'
import { ExclamationCircleOutlined } from 'infra-design-icons'
import { useState, useEffect } from 'react'
import semver from 'semver'
import 'infrad/dist/antd.css'
import { ajax } from 'rxjs/ajax'
import { catchError, interval as rxjsInterval, NEVER, switchMap} from 'rxjs'

interface IVersionDetectorProps {
  localVersion: Record<string, any>
  cancelable?: boolean
  url?: string
  interval?: number
}

function getVersionApi(url: string) {
  return ajax.getJSON<{
    [key: string]: any
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
      const localVersions = Object.keys(localVersion)
      if (localVersions.length === 0) {
        console.error('there is no version in your localVersion')
        return
      }
      const s = rxjsInterval(interval * 1000).pipe(switchMap(() => {
        return getVersionApi(url).pipe(catchError((e) => {
          console.error(e)
          return NEVER
        }))
      })).subscribe(res => {
        const remoteVersions = Object.keys(res)
        if (remoteVersions.length === 0) {
          console.error(`there is no version ${url}`)
          return
        }
        remoteVersions.sort((v1, v2) => semver.compare(v2, v1))
        localVersions.sort((v1, v2) => semver.compare(v2, v1))
        const latestServerVersion = remoteVersions[0]
        const latestLocalVersion = localVersions[0]
        if (latestServerVersion !== latestLocalVersion) {
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
