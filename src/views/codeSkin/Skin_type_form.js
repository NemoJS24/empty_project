/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function Skin_type_form() {

  const [ShowEmail, setShowEmail] = useState(false)
  const quesList = [
    {
      title: "How many birthdays have you celebrated?",
      opts: [
        "<18",
        "18-24",
        "25-34",
        "35-44",
        "45-54",
        "55-64",
        "65>"
      ]
    },
    {
      title: "How would you best describe your skin?",
      opts: [
        "Shines all over",
        "Shine on the nose only",
        "Dry",
        "Acne-prone",
        "Sensitive"
      ]
    },
    {
      title: "Do you use sunscreen?",
      opts: [
        "Yes, on my face",
        "Yes, also on my body",
        "No, I don’t use",
        "Very occasionally"
      ]
    },
    {
      title: "Does your skin react to any cosmetics (allergies, skin reaction)?",
      opts: [
        "Yes",
        "No"
      ]
    },
    {
      title: "Does your skin have acne/pimples?",
      opts: [
        "Very often",
        "Sometimes",
        "Very seldom",
        "Don’t have acne, pimples"
      ]
    },
    {
      title: "If you are out for long hours during the day e.g. cycling, swimming, scuba diving, trekking, para gliding do you required long lasting sunscreen that last for upto 8 hours?",
      opts: [
        "Yes",
        "No"
      ]
    },

    {
      title: "Do you prefer tinted sunscreens?",
      opts: [
        "Yes",
        "No"
      ]
    },
    {
      title: "Which of the following skin descriptions fits you?",
      opts: [
        "Marks due to acne",
        "Brown patches on the face",
        "Excessive redness on the face"
      ]
    },
    {
      title: "Do you prefer safe sunscreen during pregnancy?",
      opts: [
        "Yes",
        "No"
      ]
    }
  ]

  const [FormData, setFormData] = useState({
    Q1: '',
    Q2: '',
    Q3: '',
    Q4: '',
    Q5: '',
    Q6: '',
    Q7: '',
    Q8: '',
    Q9: ''
  })


  const submitForm = (e) => {
    e.preventDefault()
    // console.log(FormData)
    let newRecommendation = 'default_new'
    for (const key in FormData) {
      if (FormData.hasOwnProperty(key) && FormData[key] !== '') {
        console.log(`${key}: ${FormData[key]}`)
        if (key === 'Q2') {
          if (FormData[key] === 'Shines all over') {
            newRecommendation = "UltraMatte Oil-free Fluid"
          }
          if (FormData[key] === 'Shine on the nose only') {
            newRecommendation = "UltraMatte Oil-free Fluid"
          }
          if (FormData[key] === 'Dry') {
            newRecommendation = "UltraLite Fluid or UltraProtect Fluid based on the below answers"
          }
          if (FormData[key] === 'Acne-prone') {
            newRecommendation = "UltraMatte Mineral Gel"
          }
          if (FormData[key] === 'Sensitive') {
            newRecommendation = "UltraSensitive Mineral"
          }
        }
        if (key === 'Q3') {
          if (FormData[key] === 'Yes, also on my body') {
            newRecommendation = "UltraLite Body Spray"
          }
        }
        if (key === 'Q4') {
          if (FormData[key] === 'Yes') {
            newRecommendation = "UltraSensitive Mineral Gel"
          }
        }
        if (key === 'Q5') {
          if (FormData[key] === 'Very often') {
            newRecommendation = "UltraMatte Mineral Gel"
          }
          if (FormData[key] === 'Sometimes') {
            newRecommendation = "UltraMatte Mineral Gel"
          }
          if (FormData[key] === 'Very seldom') {
            newRecommendation = "UltraLite Fluid"
          }
        }
        if (key === 'Q6') {
          if (FormData[key] === 'Yes') {
            newRecommendation = "UltraProtect Fluid"
          }
        }
        if (key === 'Q7') {
          if (FormData[key] === 'Yes') {
            newRecommendation = "UltraSensitive Mineral"
          }
        }
        if (key === 'Q8') {
          if (FormData[key] === 'Marks due to acne') {
            newRecommendation = "UltraMatte Mineral"
          }
          if (FormData[key] === 'Brown patches on the face') {
            newRecommendation = "UltraProtect Fluid"
          }
          if (FormData[key] === 'Excessive redness on the face') {
            newRecommendation = "UltraSensitive Mineral"
          }
        }
        if (key === 'Q9') {
          if (FormData[key] === 'Yes') {
            newRecommendation = "UltraSensitive Mineral"
          }
        }
      }
    }
    toast.success(newRecommendation)
    console.log("newRecommendation =", newRecommendation)
  }

  const updateState = (key, value) => {
    setFormData(prevState => ({ ...prevState, [key]: value }))
  }


  return (
    <div className=' m-auto' style={{ maxWidth: "1440px", paddingBottom: "200px" }}>
      <style>
        {`
                .cyberpunk-checkbox {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    min-width: 16px;
                    min-height: 16px;
                    max-width: 16px;
                    max-height: 16px;
                    border: 1px solid #6b6b6b;
                    border-radius: 5px;
                    background-color: transparent;
                    display: inline-block;
                    position: relative;
                    margin-right: 10px;
                    cursor: pointer;
                }
                
                .cyberpunk-checkbox:before {
                    content: "";
                    background-color: #6b6b6b;
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    border-radius: 3px;
                    width: 8px;
                    height: 8px;
                    min-width: 8px;
                    min-height: 8px;
                    max-width: 8px;
                    max-height: 8px;
                    transition: all 0.3s ease-in-out;
                }
                
                .cyberpunk-checkbox:checked:before {
                    transform: translate(-50%, -50%) scale(1);
                }
                
                .cyberpunk-checkbox-label {
                    cursor: pointer;
                    user-select: none;
                    display: flex;
                    align-items: center;
                    justify-content:start;
                    gap:10px;
      }
      @media only screen and (max-width: 600px) {
        .cyberpunk-checkbox-label {
         font-size:calc(1.0836rem + 0.0032vw);
         gap:7px

        }
      }

         `}
      </style>
      <div className='border rounded-3  m-auto  py-2 mt-2 px-2' style={{ maxWidth: "1000px" }}>
        <h2 className='f text-center m-0  p-0'>Skin Type Test</h2>
        <hr className='mt-2' />

        {
          !ShowEmail &&
          <form action="" className=' mt-3 d-flex flex-column m-auto gap-3' style={{ maxWidth: "800px" }}>
            {
              quesList.map((data, index) => {
                return (
                  <div className=' '>
                    <div className='ms-1 ms-md-2 '>

                      <div className='d-flex'>
                        <span className='h2 me-1'>{index + 1}.</span>
                        <div className='h2'>{data.title}</div>
                      </div>
                      <div className='d-flex  ms-4  flex-column' style={{ marginTop: "4px" }}>
                        {
                          data.opts.map((opt, index2) => (

                            <label class="cyberpunk-checkbox-label h4 " style={{ marginTop: "2px" }}>
                              <input type="radio" name={`Q${index + 1}`} class="cyberpunk-checkbox " value={opt} onChange={(e) => updateState(`Q${index + 1}`, e.target.value)} />
                              {opt}</label>
                          ))}

                      </div>
                    </div>
                    {/* <hr className='mt-1 pb-1' /> */}
                  </div>
                )
              })
            }
            <div className='text-center mb-2 mt-2'>
              <button onClick={() => setShowEmail(true)} className='btn  btn-primary fs-5 text-secondary '>Find Skin Type</button>
            </div>
            <button onClick={submitForm}>show result</button>
          </form>
        }
        {
          ShowEmail &&
          <form className='mt-3 ms-2'>

            <div className='h3'>Do you want to receive our newsletters, which have exclusive offers, early access, and information about new product releases? ( if you sign-up you will receive a 10% discount on your first CodeSkin purchase)
            </div>
            <div className=' m-auto' style={{ maxWidth: "425px" }}>
              <div className='mt-2'>
                <label className='h3'>E-mail</label>
                <input className='form-control' placeholder="yourmail@gmail.com" style={{ maxWidth: "425px" }} />
              </div>

              <div className='text-center mb-2 mt-2'>
                <button onClick={() => setShowEmail(false)} className='btn  btn-primary fs-5 text-secondary px-3'>Submit</button>
              </div>
            </div>

          </form>

        }

      </div>

    </div>
  )
}
