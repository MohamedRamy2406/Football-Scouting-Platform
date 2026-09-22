import {
  useEffect,
  useState
} from 'react';

import {
  getPlayerVideos,
  uploadPlayerVideo,
  deletePlayerVideo
} from '../../api/playerApi.js';

import API_BASE_URL from '../../api/client.js';

import { useTranslation } from 'react-i18next';


const MAX_VIDEO_SIZE =
  500 * 1024 * 1024;

const MAX_VIDEO_DURATION = 300;

const VIDEO_CATEGORIES = [
  'MATCH',
  'TRAINING',
  'SOLO_TRAINING',
  'SKILLS',
  'HIGHLIGHTS',
  'OTHER'
];


const Videos = ({
  profileCompleted
}) => {

  const { t } = useTranslation();


  const [videos, setVideos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');


  const [selectedFile, setSelectedFile] =
    useState(null);

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [category, setCategory] =
    useState('');


  const loadVideos = async () => {

    try {

      setLoading(true);
      setError('');

      const result =
        await getPlayerVideos();

      if (
        result?.response?.ok &&
        Array.isArray(result?.data?.videos)
      ) {
        setVideos(
          result.data.videos
        );
      } else {

        setError(
          result?.data?.message ||
            t(
              'playerProfile.videos.errors.loadFailed'
            )
        );
      }

    } catch (err) {

      console.error(
        'Failed to load videos:',
        err
      );

      setError(
        t(
          'playerProfile.videos.errors.loadFailed'
        )
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadVideos();

  }, []);


  const resetForm = () => {

    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setCategory('');

    const fileInput =
      document.getElementById(
        'player-video-file'
      );

    if (fileInput) {
      fileInput.value = '';
    }
  };


  const handleFileChange = async (
    event
  ) => {

    const file =
      event.target.files?.[0];

    setError('');
    setSuccess('');

    if (!file) {

      setSelectedFile(null);

      return;
    }


    if (
      ![
        'video/mp4',
        'video/quicktime',
        'video/webm'
      ].includes(file.type)
    ) {

      setError(
        t(
          'playerProfile.videos.errors.invalidType'
        )
      );

      event.target.value = '';
      setSelectedFile(null);

      return;
    }


    if (
      file.size >
      MAX_VIDEO_SIZE
    ) {

      setError(
        t(
          'playerProfile.videos.errors.fileTooLarge'
        )
      );

      event.target.value = '';
      setSelectedFile(null);

      return;
    }


    setSelectedFile(file);


    /*
      Friendly frontend duration check.

      The backend FFprobe check remains
      the final authority.
    */
    try {

      const video =
        document.createElement('video');

      video.preload = 'metadata';

      const objectUrl =
        URL.createObjectURL(file);

      video.src = objectUrl;

      video.onloadedmetadata = () => {

        URL.revokeObjectURL(
          objectUrl
        );

        if (
          video.duration >
          MAX_VIDEO_DURATION
        ) {

          setError(
            t(
              'playerProfile.videos.errors.tooLong'
            )
          );

          setSelectedFile(null);

          const fileInput =
            document.getElementById(
              'player-video-file'
            );

          if (fileInput) {
            fileInput.value = '';
          }
        }
      };

      video.onerror = () => {

        URL.revokeObjectURL(
          objectUrl
        );

      };

    } catch (err) {

      console.error(
        'Could not check video duration:',
        err
      );

    }
  };


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError('');
    setSuccess('');


    if (!profileCompleted) {

      setError(
        t(
          'playerProfile.videos.errors.profileIncomplete'
        )
      );

      return;
    }


    if (!selectedFile) {

      setError(
        t(
          'playerProfile.videos.errors.fileRequired'
        )
      );

      return;
    }


    if (!title.trim()) {

      setError(
        t(
          'playerProfile.videos.errors.titleRequired'
        )
      );

      return;
    }


    if (!category) {

      setError(
        t(
          'playerProfile.videos.errors.categoryRequired'
        )
      );

      return;
    }


    try {

      setUploading(true);

      const result =
        await uploadPlayerVideo(
          selectedFile,
          title.trim(),
          description.trim(),
          category
        );


      if (
        result?.response?.ok
      ) {

        setSuccess(
          t(
            'playerProfile.videos.success.uploaded'
          )
        );

        resetForm();

        await loadVideos();

      } else {

        const message =
          result?.data?.message ||
          t(
            'playerProfile.videos.errors.uploadFailed'
          );

        setError(message);

      }

    } catch (err) {

      console.error(
        'Failed to upload video:',
        err
      );

      setError(
        t(
          'playerProfile.videos.errors.uploadFailed'
        )
      );

    } finally {

      setUploading(false);

    }
  };


  const handleDelete = async (
    videoId
  ) => {

    const confirmed =
      window.confirm(
        t(
          'playerProfile.videos.deleteConfirm'
        )
      );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(videoId);
      setError('');
      setSuccess('');

      const result =
        await deletePlayerVideo(
          videoId
        );


      if (
        result?.response?.ok
      ) {

        setVideos(
          currentVideos =>
            currentVideos.filter(
              video =>
                video.id !== videoId
            )
        );

        setSuccess(
          t(
            'playerProfile.videos.success.deleted'
          )
        );

      } else {

        setError(
          result?.data?.message ||
            t(
              'playerProfile.videos.errors.deleteFailed'
            )
        );

      }

    } catch (err) {

      console.error(
        'Failed to delete video:',
        err
      );

      setError(
        t(
          'playerProfile.videos.errors.deleteFailed'
        )
      );

    } finally {

      setDeletingId(null);

    }
  };


  const getVideoUrl = (
    videoUrl
  ) => {

    if (!videoUrl) {
      return '';
    }

    if (
      videoUrl.startsWith('http://') ||
      videoUrl.startsWith('https://')
    ) {
      return videoUrl;
    }

    return `${API_BASE_URL}${videoUrl}`;
  };


  const formatDuration = (
    seconds
  ) => {

    if (
      !Number.isFinite(
        Number(seconds)
      )
    ) {
      return '';
    }

    const totalSeconds =
      Math.round(
        Number(seconds)
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const remainingSeconds =
      totalSeconds % 60;

    return `${minutes}:${String(
      remainingSeconds
    ).padStart(2, '0')}`;
  };


  const formatUploadDate = (
    date
  ) => {

    if (!date) {
      return '';
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return '';
    }

    return parsedDate.toLocaleDateString();
  };


  if (!profileCompleted) {

    return (
      <section className="video-section">

        <div className="video-lock-notice">

          <div className="lock-icon">
            🔒
          </div>

          <div>

            <strong>
              {t(
                'playerProfile.videos.lockedTitle'
              )}
            </strong>

            <p>
              {t(
                'playerProfile.videos.lockedDescription'
              )}
            </p>

          </div>

        </div>

      </section>
    );
  }


  return (
    <section className="video-section">

      {/* ======================================
          UPLOAD FORM
      ====================================== */}

      <div className="video-upload-section">

        <div className="video-section-heading">

          <div>

            <span className="video-section-label">
              {t(
                'playerProfile.videos.label'
              )}
            </span>

            <h2>
              {t(
                'playerProfile.videos.title'
              )}
            </h2>

          </div>

        </div>


        <form
          className="video-upload-form"
          onSubmit={handleSubmit}
        >

          <div className="video-form-group">

            <label htmlFor="player-video-file">
              {t(
                'playerProfile.videos.form.file'
              )}
            </label>

            <input
              id="player-video-file"
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              disabled={uploading}
            />

            <small>
              {t(
                'playerProfile.videos.form.fileHint'
              )}
            </small>

          </div>


          <div className="video-form-group">

            <label htmlFor="player-video-title">
              {t(
                'playerProfile.videos.form.title'
              )}
            </label>

            <input
              id="player-video-title"
              type="text"
              value={title}
              maxLength={150}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder={t(
                'playerProfile.videos.form.titlePlaceholder'
              )}
              disabled={uploading}
            />

          </div>


          <div className="video-form-group">

            <label htmlFor="player-video-category">
              {t(
                'playerProfile.videos.form.category'
              )}
            </label>

            <select
              id="player-video-category"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
              disabled={uploading}
            >

              <option value="">
                {t(
                  'playerProfile.videos.form.categoryPlaceholder'
                )}
              </option>

              {VIDEO_CATEGORIES.map(
                categoryOption => (
                  <option
                    key={categoryOption}
                    value={categoryOption}
                  >
                    {t(
                      `playerProfile.videos.categories.${categoryOption}`
                    )}
                  </option>
                )
              )}

            </select>

          </div>


          <div className="video-form-group">

            <label htmlFor="player-video-description">
              {t(
                'playerProfile.videos.form.description'
              )}
            </label>

            <textarea
              id="player-video-description"
              value={description}
              maxLength={2000}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder={t(
                'playerProfile.videos.form.descriptionPlaceholder'
              )}
              disabled={uploading}
            />

            <small>
              {description.length} / 2000
            </small>

          </div>


          {error && (
            <div className="video-message video-message-error">
              {error}
            </div>
          )}


          {success && (
            <div className="video-message video-message-success">
              {success}
            </div>
          )}


          <button
            type="submit"
            className="video-upload-button"
            disabled={uploading}
          >

            {uploading
              ? t(
                  'playerProfile.videos.form.uploading'
                )
              : t(
                  'playerProfile.videos.form.upload'
                )}

          </button>

        </form>

      </div>


      {/* ======================================
          EXISTING VIDEOS
      ====================================== */}

      <div className="video-list-section">

        <div className="video-list-heading">

          <h2>
            {t(
              'playerProfile.videos.myVideos'
            )}
          </h2>

        </div>


        {loading ? (

          <div className="video-loading">
            {t(
              'playerProfile.videos.loading'
            )}
          </div>

        ) : videos.length === 0 ? (

          <div className="video-empty-state">

            <div className="video-empty-icon">
              🎥
            </div>

            <h3>
              {t(
                'playerProfile.videos.noVideos'
              )}
            </h3>

            <p>
              {t(
                'playerProfile.videos.noVideosDescription'
              )}
            </p>

          </div>

        ) : (

          <div className="video-grid">

            {videos.map(video => (

              <article
                className="video-card"
                key={video.id}
              >

                <video
                  className="video-player"
                  controls
                  preload="metadata"
                  src={getVideoUrl(
                    video.video_url
                  )}
                />

                <div className="video-info">

                  <h3>
                    {video.title}
                  </h3>

                  {video.description && (
                    <p>
                      {video.description}
                    </p>
                  )}

                  <span className="video-category">
                    {t(
                      `playerProfile.videos.categories.${video.category}`,
                      {
                        defaultValue:
                          video.category
                      }
                    )}
                  </span>

                  <div className="video-meta">

                    {video.duration !== null &&
                      video.duration !== undefined && (
                        <span>
                          {formatDuration(
                            video.duration
                          )}
                        </span>
                      )}

                    {video.upload_date && (
                      <span>
                        {formatUploadDate(
                          video.upload_date
                        )}
                      </span>
                    )}

                  </div>


                  <button
                    type="button"
                    className="video-delete-button"
                    onClick={() =>
                      handleDelete(
                        video.id
                      )
                    }
                    disabled={
                      deletingId === video.id
                    }
                  >

                    {deletingId === video.id
                      ? t(
                          'playerProfile.videos.deleting'
                        )
                      : t(
                          'playerProfile.videos.delete'
                        )}

                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
};


export default Videos;