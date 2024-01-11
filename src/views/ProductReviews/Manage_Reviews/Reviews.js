import { useState, useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { TfiEmail } from "react-icons/tfi"
import { BiCommentDetail } from "react-icons/bi"
import { AiOutlineClockCircle } from "react-icons/ai"
import { FiSettings, FiEdit } from "react-icons/fi"
import { IoIosArrowDown } from "react-icons/io"
import { VscVerifiedFilled } from "react-icons/vsc"
import { CgProfile } from "react-icons/cg"

import ColorsInput from "../components/ColorsInput"
import NumberInput from "../components/NumberInput"

// import blueTick from "../../Assets/blue-tick.svg"
// import arrowUp from "../../Assets/arrow-up.svg"
// import arrowDown from "../../Assets/arrow-down.svg"
// import Star from "../../Assets/default-star.svg"
// import Heart from "../../Assets/default-heart.svg"
// import Smiley from "../../Assets/default-smiley.svg"
// import blankStar from "../../Assets/blank-star.svg"
// import blankHeart from "../../Assets/blank-heart.svg"
// import blankSmiley from "../../Assets/blank-smiley.svg"
// import reviewPic from "./chad.png"
// import apiData from "@src/@core/auth/api/api.json"
import "./style/ReviewStyle.css"
import { SuperLeadzBaseURL } from "../../../assets/auth/jwtService"

const Reviews = () => {
  const initialState = { widgetTab: false, permissionTab: false, emailTab: false, emailReminderTab: false, customTab: false }
  const [openTab, setOpenTab] = useState({ ...initialState, widgetTab: true })

  const [reviewInfo, setReviewInfo] = useState({})

  const [customStyle, setCustomStyle] = useState({ primaryColor: "#000", secondaryColor: "#fd7e97", backgroundColor: "#f3ecec", fontSize: 15, fontColor: "#000", borderColor: "#000", borderSize: 0, borderRadius: 10, style: "star", defaultRating: Star, blankRating: blankStar })

  const [styleDropDown, setStyleDropDown] = useState({ basic: true, font: true, border: true, rating: true })

  const [permissionData, setPermissionData] = useState({ autoApproved: false, autoPublished: 0, anonymousLikes: false, verifiedTag: false, anonymousReviews: false, enableDislikes: false })

  const [rating, setRating] = useState({ likes: 3, dislikes: 2 })

  const apiData = {d_ngrok: ""}

  function getDateDifference(givenDate) {
    const givenDateTime = new Date(givenDate)
    const currentDateTime = new Date()
    const timeDifference = currentDateTime - givenDateTime

    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

    const givenMonth = givenDateTime.getMonth() + 1 // Months are 0-based
    const currentMonth = currentDateTime.getMonth() + 1 // Months are 0-based
    const monthsDifference = (currentDateTime.getFullYear() - givenDateTime.getFullYear()) * (12 + (currentMonth - givenMonth))

    const yearsDifference = currentDateTime.getFullYear() - givenDateTime.getFullYear()

    if (yearsDifference > 0) {
      return `${yearsDifference} years`
    } else if (monthsDifference > 0) {
      return `${monthsDifference} months`
    } else if (daysDifference > 1) {
      return `${daysDifference} days`
    } else if (daysDifference === 1) {
      return "yesterday"
    } else {
      return "today"
    }

  }

  const form_data = new FormData()
  form_data.append("shopDomain", "quickstart-6d4c5332.myshopify.com")
  form_data.append("shop", "Quickstart (6d4c5332)")

  const handleAutoApproved = async () => {
    try {
      const response = await fetch(
        `${SuperLeadzBaseURL}/toggle-status/`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': true
          },
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      setPermissionData({ ...permissionData, autoApproved: !permissionData.autoApproved })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }

  }

  const handleAnonymousReviews = async () => {
    try {
      const response = await fetch(
        `${apiData.d_ngrok}/enable-anonymous-reviews/`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': true
          },
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      setPermissionData({ ...permissionData, anonymousReviews: !permissionData.anonymousReviews })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }

  }

  const handleAnonymousLikes = async () => {
    try {
      const response = await fetch(
        `${apiData.d_ngrok}/toggle-like-config/`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': true
          },
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      setPermissionData({ ...permissionData, anonymousLikes: !permissionData.anonymousLikes })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }
  }

  const handleVerifiedTag = async () => {
    try {
      const response = await fetch(
        `${apiData.d_ngrok}/enable-verified-tag/`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': true
          },
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      setPermissionData({ ...permissionData, verifiedTag: !permissionData.verifiedTag })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }
  }

  const handleDislike = async () => {
    try {

      const response = await fetch(
        `${apiData.d_ngrok}/change-dislike-status/`,
        {
          method: 'POST',
          headers: {
            'ngrok-skip-browser-warning': true
          },
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      setPermissionData({ ...permissionData, enableDislikes: !permissionData.enableDislikes })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }
  }

  const handleSubmit = async () => {
    const form_data = new FormData()
    form_data.append('minimum_rating', permissionData.autoPublished)
    form_data.append("shopDomain", "quickstart-6d4c5332.myshopify.com")
    form_data.append("shop", "Quickstart (6d4c5332)")
    try {
      const response = await fetch(
        `${apiData.d_ngrok}/update-rating/`,
        {
          method: "POST",
          body: form_data
        }
      )

      if (!response.ok) {
        throw new Error(`Authorization failed due to:${response.status} `)
      }
      console.log("Authorization successful!")
    } catch (error) {
      console.error("Authorizing error: ", error)
    }
  }

  const handleStyling = (e, value) => {
    setCustomStyle({ ...customStyle, [e.target.name]: e.target.value })
    if (value > 20) {
      console.log(value)
    }
  }

  const handleRatingStyle = (e) => {
    const selectedValue = e.target.value
    let defaultRating, blankRating, style
    if (selectedValue === 'star') {
      style = 'star'
      defaultRating = Star
      blankRating = blankStar
    } else if (selectedValue === 'heart') {
      style = 'heart'
      defaultRating = Heart
      blankRating = blankHeart
    } else if (selectedValue === 'smiley') {
      style = 'smiley'
      defaultRating = Smiley
      blankRating = blankSmiley
    }
    setCustomStyle({ ...customStyle, style, defaultRating, blankRating })
  }

  const submitCustomStyle = () => {
    const form_data = new FormData()
    // form_data.append("uid", "bb8f4c53cb0b5e19")
    form_data.append("shopDomain", "quickstart-6d4c5332.myshopify.com")
    form_data.append("shop", "Quickstart (6d4c5332)")
    for (const item in customStyle) {
      form_data.append(item, customStyle[item])
    }
    try {
      fetch(`${apiData.d_ngrok}/store-styles/`,
        {
          method: "POST",
          body: form_data
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Authorization failed due to:${response.status} `)
          }
          console.log("Send Successful")
        })
    } catch (error) {
      console.error("Authorizing error: ", error)
    }
  }

  useEffect(() => {
    async function fetchData() {
      const url1 = `${apiData.d_ngrok}/router/review-permissions/`
      const url2 = `${apiData.d_ngrok}/styles/`
      const url3 = `${apiData.d_ngrok}/router/reviews/`

      fetch(`${apiData.d_ngrok}/router/reviews/`, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': true
        }
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Network response was not ok')
          }
          return resp.text()
        })
        .then(data => {
          const jsonData = JSON.parse(data)
          setReviewInfo({ ...jsonData })
        })
        .catch((error) => {
          console.log(error)
        })

      const responses = await Promise.all([
        fetch(url1,
          {
            method: "GET",
            headers: {
              'ngrok-skip-browser-warning': true
            }
          }),
        fetch(url2,
          {
            method: "GET",
            headers: {
              'ngrok-skip-browser-warning': true
            }
          }),
        fetch(url3,
          {
            method: "GET",
            headers: {
              'ngrok-skip-browser-warning': true
            }
          })
      ])

      const respPermissionData = await responses[0].json()
      setPermissionData({ autoApproved: respPermissionData[0].auto_approve_reviews, autoPublished: respPermissionData[0].minimum_rating, anonymousLikes: respPermissionData[0].anonymous_likes, verifiedTag: respPermissionData[0].show_verified_tag, anonymousReviews: respPermissionData[0].allow_anonymous_reviews, enableDislikes: respPermissionData[0].enable_dislikes })

      const customStyleData = await responses[1].json()
      let defaultRating, blankRating
      if (customStyleData.card_styles[0].style === 'star') {
        defaultRating = Star
        blankRating = blankStar
      } else if (customStyleData.card_styles[0].style === 'heart') {
        defaultRating = Heart
        blankRating = blankHeart
      } else if (customStyleData.card_styles[0].style === 'smiley') {
        defaultRating = Smiley
        blankRating = blankSmiley
      }

      setCustomStyle({
        primaryColor: customStyleData.card_styles[0].primary_color,
        secondaryColor: customStyleData.card_styles[0].secondary_color,
        backgroundColor: customStyleData.card_styles[0].background_color,
        fontSize: customStyleData.card_styles[0].font_size,
        fontColor: customStyleData.card_styles[0].font_color,
        borderColor: customStyleData.card_styles[0].border_color,
        borderSize: customStyleData.card_styles[0].border_size,
        borderRadius: customStyleData.card_styles[0].border_radius,
        style: customStyleData.card_styles[0].style,
        defaultRating,
        blankRating
      })

      const reviewData = await responses[2].json()
      setReviewInfo({ ...reviewData })
    }
    fetchData()
  }, [])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Settings</CardTitle>
        </CardHeader>
      </Card>
      <div className="row d-flex justify-content-evenly ">
        <div className="col-md-12">
          <ul className="nav nav-pills flex-column flex-sm-row" role="tablist">
            <li className={`nav-item nav-link pe-auto ${openTab.widgetTab ? 'active' : ''}`} onClick={() => {
              setOpenTab({ ...initialState, widgetTab: true })
            }} role="presentation">

              <BiCommentDetail style={{ fontSize: "16px" }} />Widgets

            </li>
            <li className={`nav-item nav-link pointer-event ${openTab.permissionTab ? 'active' : ''}`} onClick={() => {
              setOpenTab({ ...initialState, permissionTab: true })
            }} role="presentation">
              <FiSettings style={{ fontSize: "16px" }} />Permissions
            </li>
            <li className={`nav-item nav-link pointer-event ${openTab.emailTab ? 'active' : ''}`} onClick={() => {
              setOpenTab({ ...initialState, emailTab: true })
            }} role="presentation">

              <TfiEmail style={{ fontSize: "16px" }} />Emails
            </li>
            <li className={`nav-item nav-link pointer-event ${openTab.emailReminderTab ? 'active' : ''}`} onClick={() => {
              setOpenTab({ ...initialState, emailReminderTab: true })
            }} role="presentation">

              <AiOutlineClockCircle style={{ fontSize: "16px" }} />Integrations

            </li>
            <li className={`nav-item nav-link pointer-event ${openTab.customTab ? 'active' : ''}`} onClick={() => {
              setOpenTab({ ...initialState, customTab: true })
            }} role="presentation">
              <FiEdit style={{ fontSize: "16px" }} />Custom
            </li>
          </ul>
        </div>
      </div>

      {/* widget tab */}
      {openTab.widgetTab && (
        <>
          <Card>
            <CardBody className="text-center">
              <h5 className="row fs-4 d-flex justify-content-center fw-bolder"
                style={{ paddingBottom: "6px" }}
              >
                Customer Reviews
              </h5>
              <div className="star-rating">

                <span style={{ fontSize: "12px", marginLeft: "6px", fontWeight: "500" }}>
                  {reviewInfo?.average_rating?.toFixed(1) || 0} out of 5
                </span>
              </div>
              <div
                className="pb-1"
                style={{ fontSize: "12px", fontWeight: "bold", paddingTop: "4px" }}
              >
                Based on {reviewInfo?.total_reviews || 0} Reviews
              </div>
              {/* <div
                className="HeadReview text-nowrap"
                style={{
                  paddingTop: "5.5px",
                  paddingBottom: "1px",
                  marginLeft: "50px",
                  marginRight: "50px",
                  marginBottom: "0px"
                }}
              >
                <h4
                  style={{ color: "white", fontSize: "13px" }}
                >
                  <span className="NoSelect">Write a review</span>
                </h4>
              </div> */}
            </CardBody>
          </Card>

          <div className="row d-grid-col justify-content-evenly" style={{ overflow: "hidden", overflowY: "auto" }}>
            {/* {renderReviews()} */}
            {
              reviewInfo?.reviews?.reverse().map((review, index) => {
                const starImages = Array(5).fill(blankStar)

                for (let i = 0; i < review?.rating; i++) {
                  starImages[i] = Star
                }
                return (
                  <div key={index} className="col-lg-4">
                    <Card className="CardHeight">
                      <CardBody>
                        <div className="row">
                          <div className="col-md-8 col-4 text-nowrap">
                            <CgProfile
                              style={{
                                fontSize: "28px",
                                marginRight: "4px",
                                marginBottom: "5px"
                              }}
                            />
                            <span className="fw-bold">{review?.customer.name}</span>
                            <VscVerifiedFilled
                              style={{
                                color: "#4FB6EC",
                                fontSize: "16px",
                                marginBottom: "4px",
                                marginLeft: "2px"
                              }}
                            />
                          </div>
                          <div className="col-md-4 col-8 text-end text-nowrap">
                            <span className="ReviewPeriod">{getDateDifference(review?.created_at)}</span>
                          </div>
                        </div>
                        <div className="row pt-2">
                          <div className="col-lg-6 fw-bold">{review?.review}</div>
                          <div className="col-lg-6 ">
                            {starImages.map(() => <img src={''} alt="star" />)}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )
              })
            }
          </div>

        </>
      )}

      {/* permission */}
      {openTab.permissionTab && (
        <Card className="permission-tab-popup p-0 mx-auto" style={{ maxWidth: "400px" }}>
          <CardBody className="text-start">
            <div className="row d-flex text-warp text-md-nowarp ">
              <div className="col-sm-8 col-8 d-flex justify-content-start ">
                <h4 className="PermissionFont py-1">
                  Auto-approve review submissions
                </h4>
              </div>
              <div className="col-sm-4 col-4  form-check form-switch my-1 d-flex justify-content-end">
                <input
                  className="tgglSize form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => {
                    console.log("to")
                    handleAutoApproved()
                  }}
                  checked={permissionData.autoApproved}
                />
              </div>
            </div>
            <div className="row d-flex text-warp text-md-nowarp ">
              <div className="col-sm-8 col-8 d-flex justify-content-start ">
                <h4 className="PermissionFont py-1">Allow anonymous reviews</h4>
              </div>
              <div className="col-sm-4 col-4  form-check form-switch my-1 d-flex justify-content-end">
                <input
                  className="tgglSize form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => {
                    handleAnonymousReviews()
                  }}
                  checked={permissionData.anonymousReviews}
                />
              </div>
            </div>
            <div className="row d-flex text-warp text-md-nowarp ">
              <div className="col-sm-8 col-8 d-flex justify-content-start ">
                <h4 className="PermissionFont py-1">
                  Allow anonymous Likes
                </h4>
              </div>
              <div className="col-sm-4 col-4  form-check form-switch my-1 d-flex justify-content-end">
                <input
                  className="tgglSize form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={handleAnonymousLikes}
                  checked={permissionData.anonymousLikes}
                />
              </div>
            </div>
            <div className="row d-flex text-warp text-md-nowarp ">
              <div className="col-sm-8 col-8 d-flex justify-content-start ">
                <h4 className="PermissionFont py-1 ">Display ‘Verified’ tag</h4>
              </div>
              <div className="col-sm-4 col-4  form-check form-switch my-1 d-flex justify-content-end">
                <input
                  className="tgglSize form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => (
                    handleVerifiedTag()
                  )}
                  checked={permissionData.verifiedTag}
                />
              </div>
            </div>
            <div className="row d-flex text-warp text-md-nowarp ">
              <div className="col-sm-8 col-8 d-flex justify-content-start ">
                <h4 className="PermissionFont py-1 ">Enable dislikes</h4>
              </div>
              <div className="col-sm-4 col-4  form-check form-switch my-1 d-flex justify-content-end">
                <input
                  className="tgglSize form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => (
                    handleDislike()
                  )}
                  checked={permissionData.enableDislikes}
                />
              </div>
            </div>
            <div className={`row d-flex ${permissionData.autoApproved ? "nonClickableDiv" : ""}`}>
              <div className="col d-flex justify-content-start ">
                <h4 className="PermissionFont py-1">
                  Auto-publish reviews that are {permissionData.autoPublished} stars & above
                </h4>
              </div>
              <div className="col d-flex justify-content-end p-0">
                <select
                  className="my-1 me-1 ps-1"
                  style={{ width: "50px", height: "20px" }}
                  onChange={(e) => setPermissionData({ ...permissionData, autoPublished: e.target.value })}
                  value={permissionData.autoPublished}
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>
            <div className=" d-flex justify-content-end">
              <button className={`btn btn-primary ${permissionData.autoApproved ? "nonClickableDiv" : ""}`} onClick={() => handleSubmit()}>Save</button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* email tab */}
      {openTab.emailTab && (
        <Card className="email-tab-popup p-0">
          <CardBody>
            <h2 className="text-center">Email Tab</h2>
          </CardBody>
        </Card>
      )}

      {/* Email Reminder Tab */}
      {openTab.emailReminderTab && (
        <div className="row emailReminder-tab-popup p-0">
          {/* customer */}
          <div className="col-md">
            <Card className="customer-tab-popup p-0">
              <CardBody>
                <h5 className="fw-bolder">Send XX email reminders</h5>
                <p style={{ fontSize: "12px", fontWeight: "500" }}>
                  1st reminder XX days after product delivery
                </p>
                <p style={{ fontSize: "12px", fontWeight: "500" }}>
                  2nd reminder XX days after product delivery
                </p>
                <p style={{ fontSize: "12px", fontWeight: "500" }}>
                  3rd reminder XX days after product delivery
                </p>
              </CardBody>
            </Card>
          </div>
          {/* Admin */}
          <div className="col-md">
            <Card className="Equal-Card admin-tab-popup p-0">
              <CardBody>
                <div>
                  <div>
                    <h4 className="fs-5 text-nowarp fw-bolder">
                      New review notification
                    </h4>
                  </div>
                  <div className="col form-check form-switch my-1 ">
                    <input
                      className="tgglSize form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    />
                  </div>
                  <div>
                    <h6 style={{ fontSize: "11px", color: "grey", opacity: "0.8" }}>
                      Get email notice when product gets a new review
                    </h6>
                  </div>
                </div>

              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Custom Tab */}
      {openTab.customTab && (
        <Row className="" >
          <Col md="8">
            <div className="" style={{ width: "95%", margin: "20px", padding: "20px", color: `${customStyle.fontColor}`, backgroundColor: `${customStyle.backgroundColor}`, border: `${customStyle.borderSize}px solid ${customStyle.borderColor}`, borderRadius: `${customStyle.borderRadius}px` }}>
              <div className="d-flex justify-content-center">

                <div style={{ width: "25%" }}>
                  <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                    <div className=" d-flex justify-content-center align-items-center" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: `${customStyle.secondaryColor}`, color: "#FFF" }}>
                      <span>JD</span>
                    </div>
                    <div>
                      <h6 className=" m-0" style={{ fontWeight: "900", color: `${customStyle.fontColor}` }}>Rajeev Tikekar</h6>
                      <span className="flex-between verified" style={{ gap: "5px", fontSize: "12px" }}>
                        <img src={''} alt="Blue Tick" className="blue-tick" />
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>


                <div style={{ width: "70%" }}>
                  <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "10px" }}>
                    <div className="d-flex justify-content-start align-items-center gap-1">
                      <img src={''} alt="default-star" style={{ width: "20px" }} />
                      <img src={''} alt="default-star" style={{ width: "20px" }} />
                      <img src={''} alt="default-star" style={{ width: "20px" }} />
                      <img src={''} alt="blank-star" style={{ width: "20px" }} />
                      <img src={''} alt="blank-star" style={{ width: "20px" }} />
                    </div>
                    <p style={{ color: `${customStyle.fontColor}` }}>21/08/2023</p>
                  </div>

                  <p style={{ fontSize: `${customStyle.fontSize}px`, color: `${customStyle.fontColor}`, marginBottom: "10px" }}>
                    Best Service I've ever got... keep it up Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Dignissimos, minus iusto! Veniam atque
                    porro ipsa nobis adipisci vel facilis, laborum quidem amet eveniet
                    vero maiores aliquid minus ut natus? Tempore.
                  </p>

                  <div className="d-flex justify-content-between">
                    <img src={''} alt="review" width="80" height="80" />

                    <div className="d-flex justify-content-start align-items-center align-self-end">

                      <button className="d-flex justify-content-start align-items-center border-0 bg-transparent px-1" onClick={() => setRating({ ...rating, likes: rating.likes + 1 })}>
                        <img src={''} alt="arrow up" />
                      </button>

                      <p className="p-0 m-0" style={{ color: `${customStyle.fontColor}` }}>{rating.likes}</p>

                      <button className="d-flex justify-content-start align-items-center border-0 bg-transparent px-1" onClick={() => setRating({ ...rating, dislikes: rating.dislikes + 1 })}>
                        <img src={''} alt="arrow down" />
                      </button>

                      <p className="p-0 m-0" style={{ color: `${customStyle.fontColor}` }}>{rating.dislikes}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* <div style={{ margin: "20px", padding: "20px", color: `${customStyle.fontColor}`, backgroundColor: `${customStyle.backgroundColor}`, border: `${customStyle.borderSize}px solid ${customStyle.borderColor}`, borderRadius: `${customStyle.borderRadius}px` }}>
              <div className=" d-flex justify-content-between align-items-center ">
                <div className=" d-flex justify-content-center align-items-center gap-1">
                  <img src={customStyle.defaultRating} alt="star" />
                  <img src={customStyle.defaultRating} alt="star" />
                  <img src={customStyle.defaultRating} alt="star" />
                  <img src={customStyle.defaultRating} alt="star" />
                  <img src={customStyle.blankRating} alt="blank" />
                </div>
                <p className="m-0" style={{ color: `${customStyle.fontColor}` }}>Yesterday</p>
              </div>

              <div className=" d-flex align-items-center" style={{ gap: "5px", marginTop: "8px", marginBottom: "20px" }}>
                <div className=" d-flex justify-content-center align-items-center" style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: `${customStyle.secondaryColor}`, color: "#FFF" }}>
                  <span>JD</span>
                </div>
                <h4 className=" m-0" style={{ fontWeight: "900", color: `${customStyle.fontColor}` }}>Rajeev Tikekar</h4>
                <img
                  src={blueTick}
                  alt="Blue Tick"
                  className="blue-tick"
                />
              </div>

              <p style={{ fontSize: `${customStyle.fontSize}px`, color: `${customStyle.fontColor}` }}>
                Best Service I've ever got... keep it up Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Dignissimos, minus iusto! Veniam atque
                porro ipsa nobis adipisci vel facilis, laborum quidem amet eveniet
                vero maiores aliquid minus ut natus? Tempore.
              </p>

              <div className=" d-flex justify-content-end align-items-start" style={{ gap: "5px" }}>

                <button className=" bg-transparent pointer-event border-0 ">
                  <img src={arrowUp} alt="arrow up" />
                </button>

                <p>3</p>

                <button className=" bg-transparent pointer-event border-0 ">
                  <img src={arrowDown} alt="arrow down" />
                </button>

                <p>2</p>
              </div>
            </div> */}
          </Col>

          <Col md="4">
            <Card style={{ height: "60vh", overflowY: "scroll" }}>
              {/* <Card> */}
              <CardBody className=" position-relative pt-0">
                <div className=" bg-white d-flex justify-content-between align-items-center pt-1 mb-2 position-sticky top-0 z-1">
                  <h3>Custom Form</h3>
                  <button className=" btn btn-primary" onClick={submitCustomStyle}>Save</button>
                </div>

                <Row>
                  <Col md="12">
                    <div className=" d-flex justify-content-between align-items-center gap-1 mb-1" onClick={() => setStyleDropDown({ ...styleDropDown, basic: !styleDropDown.basic })}>
                      <h4 className="m-0" style={{ cursor: "pointer" }}>Basic</h4>
                      <IoIosArrowDown size={20} />
                    </div>
                    <div className={`styleDrop ${styleDropDown.basic ? " styleDropDown mb-4" : " styleDropUp mb-1"}`}>
                      {/* <div className={"styleDrop styleDropDown mb-4"}> */}
                      <ColorsInput title="Primary Color" name='primaryColor' value={customStyle.primaryColor} handleStyling={handleStyling} />
                      <ColorsInput title="Secondary Color" name='secondaryColor' value={customStyle.secondaryColor} handleStyling={handleStyling} />
                      <ColorsInput title="Background Color" name='backgroundColor' value={customStyle.backgroundColor} handleStyling={handleStyling} />
                    </div>
                  </Col>

                  <Col md="12">
                    <div className=" d-flex justify-content-between align-items-center gap-1 mb-1" onClick={() => setStyleDropDown({ ...styleDropDown, font: !styleDropDown.font })}>
                      <h4 className="m-0" style={{ cursor: "pointer" }}>Font</h4>
                      <IoIosArrowDown size={20} />
                    </div>
                    <div className={`styleDrop ${styleDropDown.font ? " styleDropDown mb-4" : " styleDropUp mb-1"}`}>
                      {/* <div className={"styleDrop styleDropDown mb-4"}> */}
                      <NumberInput title="Font Size" name='fontSize' value={customStyle.fontSize} handleStyling={handleStyling} min={10} max={20} />
                      <ColorsInput title="Font Color" name='fontColor' value={customStyle.fontColor} handleStyling={handleStyling} />
                    </div>
                  </Col>

                  <Col md="12">
                    <div className=" d-flex justify-content-between align-items-center gap-1 mb-1" onClick={() => setStyleDropDown({ ...styleDropDown, border: !styleDropDown.border })}>
                      <h4 className="m-0" style={{ cursor: "pointer" }}>Border</h4>
                      <IoIosArrowDown size={20} />
                    </div>
                    <div className={`styleDrop ${styleDropDown.border ? " styleDropDown mb-4" : " styleDropUp mb-1"}`}>
                      {/* <div className={"styleDrop styleDropDown mb-4"}> */}
                      <ColorsInput title="Border Color" name='borderColor' value={customStyle.borderColor} handleStyling={handleStyling} />
                      <NumberInput title="Border Size" name='borderSize' value={customStyle.borderSize} handleStyling={handleStyling} min={0} max={10} />
                      <NumberInput title="Border radius" name='borderRadius' value={customStyle.borderRadius} handleStyling={handleStyling} min={0} max={30} />
                    </div>
                  </Col>

                  <Col md="12">
                    <div className=" d-flex justify-content-between align-items-center gap-1 mb-1" onClick={() => setStyleDropDown({ ...styleDropDown, rating: !styleDropDown.rating })}>
                      <h4 className="m-0" style={{ cursor: "pointer" }}>Rating</h4>
                      <IoIosArrowDown size={20} />
                    </div>
                    <div className={`styleDrop ${styleDropDown.rating ? " styleDropDown mb-4" : " styleDropUp mb-1"}`}>
                      {/* <div className={"styleDrop styleDropDown mb-4"}> */}
                      <select className="form-control mb-1 mx-0 w-75" value={customStyle.style} onChange={(e) => handleRatingStyle(e)}>
                        <option className="p-1" value="star">Star</option>
                        <option className="p-1" value="heart">Heart</option>
                        <option className="p-1" value="smiley">Smiley</option>
                      </select>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

          </Col>
        </Row>
      )}
    </>
  )
}

export default Reviews
