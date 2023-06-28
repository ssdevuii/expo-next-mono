import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { EditorState, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import cx from 'classnames'
import { Helmet } from 'react-helmet-async'
import './style.scss'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// * redux
import { likeKarya } from '../../redux/user/userSlice'

// * assets
import heartSolid from '../../assets/icons/heart-solid.svg'
import imgLoad from '../../assets/images/img-placeholder.svg'
import newTabIcon from '../../assets/icons/open_in_new-black-18dp.svg'
import fbIcon from '../../assets/icons/fb-blue-squere.svg'
import twitterIcon from '../../assets/icons/twitter-blue-squere.svg'
import axios from 'axios'
import API_ENDPOINT from '../../config/api/api'

// * local components. it wont be use in other file. and it should not.
const Img = ({ src, alt }) => (
  <div className="karyaContent__poster">
    <LazyLoadImage
      src={src}
      placeholderSrc={imgLoad}
      wrapperClassName="karyaContent__poster__imgWrapper"
      className="karyaContent__poster__img"
      alt={`poster ${alt}`}
    />
  </div>
)

const Desc = ({ desc }) => {
  const { t } = useTranslation(['karya'])
  return (
    <div className="karyaContent__desc">
      <h2 className="karyaContent__title">{t('karya:decription')}</h2>
      <Editor
        wrapperClassName="karyaContent__desc__wrapper"
        editorClassName="karyaContent__desc__wrapper__editor"
        editorState={desc}
        toolbarHidden={true}
        readOnly={true}
      />
    </div>
  )
}

const Info = ({ subjects, category, videoLink, demoLink, createdDate, lecturers }) => {
  const { t } = useTranslation(['karya'])
  return (
    <div className="karyaContent__info">
      <h2 className="karyaContent__title">{t('karya:information')}</h2>
      <div className="karyaContent__info__list">
        <ul>
          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <div className="list__subList">
              {subjects.map((obj) => (
                <span className="list__subList__span" key={obj.id}>
                  {obj.subject.name}
                </span>
              ))}
            </div>
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <div className="list__subList">
              {lecturers.map(({ lecturer }, i) => (
                <span className="list__subList__span" key={i}>
                  {lecturer.user.name}
                </span>
              ))}
            </div>
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            {/* TODO: buat translation */}
            <span className="list__text">{category}</span>
          </li>
        </ul>

        <ul>
          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            {videoLink ? (
              <a className="list__text list__text--link" target="_blank" rel="noreferrer" href={videoLink}>
                Video
                <img className="list__img" src={newTabIcon} alt="new tab" />
              </a>
            ) : (
              <span className="list__text list__text--link">Video</span>
            )}
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            {demoLink ? (
              <a className="list__text list__text--link" target="_blank" rel="noreferrer" href={demoLink}>
                Demo
                <img className="list__img" src={newTabIcon} alt="new tab" />
              </a>
            ) : (
              <span className="list__text list__text--link">Demo</span>
            )}
          </li>

          <li className="karyaContent__info__list__li">
            <span className="list__squere" />
            <span className="list__text">{createdDate.slice(0, 10).replaceAll('-', '/')}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

const Team = ({ members }) => {
  const { t } = useTranslation(['karya'])
  return (
    <div className="karyaContent__team">
      <h2 className="karyaContent__title">{t('karya:team')}</h2>
      <div className="karyaContent__team__members">
        {members.map(({ status, user }, i) => {
          return (
            status === 1 && (
              <div key={i} className="team__member">
                <img alt={user.name} src={user.profilePicture} className="team__member__avatar" />
                <div className="team__member__info">
                  <span className="team__member__info__name">{user.name}</span>
                  <span className="team__member__info__desc">
                    {user.identityNumber} - {user.roleId ? t('karya:leader') : t('karya:member')}
                  </span>
                </div>
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}

const Support = ({ isLiked = false, onClick = () => {}, likeCount = 5 }) => {
  const { t } = useTranslation(['karya'])

  return (
    <div className="karyaContent__support">
      <h2 className="karyaContent__title">{t('karya:support')}</h2>
      <div>
        <button onClick={onClick} disabled={likeCount <= 0 || isLiked} className="support__button">
          <div
            role="img"
            aria-label="Like button"
            title="clik!"
            className={cx(
              'support__button__img',
              isLiked ? 'support__button__img--liked' : 'support__button__img--like'
            )}
          />
          <span className="support__button__span">{t('karya:support_button')}</span>
        </button>
        <span className="karya__support__count">{t('karya:support_count', { count: likeCount })}</span>
      </div>
    </div>
  )
}

const Share = ({ url, name }) => {
  const { t } = useTranslation(['karya'])
  return (
    <div className="karyaContent__share">
      <h2 className="karyaContent__title">{t('karya:share')}</h2>
      <div className="karyaContent__share__button__container">
        <FacebookShareButton className="karyaContent__share__button" quote={name} hashtag="#iniHashtag" url={url}>
          <img src={fbIcon} alt="Facebook icon" />
        </FacebookShareButton>

        <TwitterShareButton className="karyaContent__share__button" url={url} title={name} hashtag="#ini #hashtag">
          <img src={twitterIcon} alt="Twitter Icon" />
        </TwitterShareButton>
      </div>
    </div>
  )
}

// * Main
const Karya = ({ user }) => {
  const { t } = useTranslation(['translation', 'karya'])
  const breakpoint = {
    tablet: 768
  }

  const { id } = useParams()
  const [isLiked, setIsLiked] = useState(false)
  const [BASE_URL] = useState(window.location.href)
  const [projects, setProjects] = useState(null)

  const [likeCount, setLikeCount] = useState(0)
  const [editorState, setEditorState] = useState(null)
  const [likeRemain, setLikeRemain] = useState(5)

  const [redirect, setRedirect] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const handleResize = () => {
    setWindowWidth(window.innerWidth)
  }

  const checkLikeReamin = useCallback(async () => {
    try {
      const isLiikedRes = await axios.get(API_ENDPOINT.likes.remain, {
        headers: {
          authToken: user.authToken
        }
      })
      const { likeRemain } = isLiikedRes.data
      setLikeRemain(likeRemain)
    } catch (error) {
      console.dir(error)
    }
  }, [user.authToken])

  const checkIsLiked = useCallback(async () => {
    try {
      const isLiikedRes = await axios.get(API_ENDPOINT.likes.isLiked(id), {
        headers: {
          authToken: user.authToken
        }
      })

      const { isLiked } = isLiikedRes.data
      setIsLiked(isLiked)
    } catch (error) {
      console.dir(error)
    }
  }, [id, user.authToken])

  const handleLike = useCallback(() => {
    const like = async () => {
      try {
        await axios.post(
          API_ENDPOINT.likes._,
          {
            projectId: id
          },
          {
            headers: {
              authToken: user.authToken
            }
          }
        )
      } catch (error) {
        console.dir(error)
      }
    }

    like()
    checkIsLiked()
    checkLikeReamin()
  }, [checkIsLiked, checkLikeReamin, id, user.authToken])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    const fetchData = async () => {
      try {
        const projects = await axios.get(API_ENDPOINT.project.id(id))
        const { project } = projects.data
        setProjects(project)
        const docState = convertFromRaw(JSON.parse(project.description))
        setEditorState(EditorState.createWithContent(docState))

        const likeCountRes = await axios.get(API_ENDPOINT.likes.count(id), {
          headers: {
            authToken: user.authToken
          }
        })
        const { likesCount } = likeCountRes.data
        setLikeCount(likesCount)
      } catch (error) {
        setRedirect(true)
        console.dir(error)
      }
    }

    checkLikeReamin()
    checkIsLiked()
    fetchData()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [checkIsLiked, checkLikeReamin, id, user.authToken])

  return redirect ? (
    <Redirect to="/" />
  ) : (
    projects !== null && (
      <main className="App">
        <Helmet>
          <title>
            {t('karya:head_title', { project_name: projects.name })} - {t('app_title')}
          </title>

          <meta name="robots" content="index, nofollow" />
        </Helmet>

        <section className="karyaHeader" id="maincontent">
          <h1 className="karyaHeader__title">{projects.name}</h1>
          <span className="karyaHeader__team">
            {t('karya:by')} {projects.team.name}
          </span>

          <div className="karyaHeader__like">
            <img src={heartSolid} alt="heart icon" className="karyaHeader__like__icon" />
            <span className="karyaHeader__like__number">{likeCount}</span>
          </div>
        </section>

        <article className="karyaContent">
          {/* FIXME: temp hack, to keep desktop version look better */}

          {windowWidth > breakpoint.tablet ? (
            <>
              <div className="karyaContent_left">
                <Img src={projects.gdriveLink} alt={projects.name} />
                <Support isLiked={isLiked} onClick={handleLike} likeCount={likeRemain} />
                <Share url={BASE_URL} name={projects.name} />
              </div>
              <div className="karyaContent_right">
                {editorState && <Desc desc={editorState} />}
                <Info
                  category={projects.category.name}
                  createdDate={projects.created_at}
                  demoLink={projects.demoLink}
                  videoLink={projects.videoLink}
                  subjects={projects.team.team_subjects}
                  lecturers={projects.team.team_subjects}
                />
                <Team members={projects.team.members} />
              </div>
            </>
          ) : (
            <>
              <Img src={projects.gdriveLink} alt={projects.name} />
              <Support isLiked={isLiked} onClick={handleLike} likeCount={likeRemain} />
              <Share url={BASE_URL} name={projects.name} />
              {editorState && <Desc desc={editorState} />}
              <Info
                category={projects.category.name}
                createdDate={projects.created_at}
                demoLink={projects.demoLink}
                videoLink={projects.videoLink}
                subjects={projects.team.team_subjects}
                lecturers={projects.team.team_subjects}
              />
              <Team members={projects.team.members} />
            </>
          )}
        </article>
      </main>
    )
  )
}

const mapDispatchToProps = (dispatch) => ({
  like: (id) => dispatch(likeKarya(id))
})

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Karya)
