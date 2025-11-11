import React from "react"
interface props{
  styles:Record<string,string>
}
function PubliationTabs ({ styles }:props) {
  return (
    <div className={styles['menu-publications']}>
      <ul>
        <li>mis publicaciones</li>
        <li>me gusta</li>
        <li>guardado</li>
      </ul>
    </div>

  )
}

export default PubliationTabs
