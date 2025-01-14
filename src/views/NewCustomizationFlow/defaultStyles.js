const moment = require("moment/moment")

export const commonObj = {
    label: "",
    class: "",
    option: [
        {
            value: "1",
            label: "Option 1"
        },
        {
            value: "2", label: "Option 2"
        }
    ],
    src: "",
    textValue: "<p>Enter Text</p>",
    editorState: "",
    isRequired: false,
    hasLabel: false,
    inputType: "email",
    placeholder: "Email",
    labelText: "Email",
    redirectType: "nextPage",
    redirectTo: "",
    style: {},
    offerIds: []
}

export const elementStyles = {
    button: {
        fontSize: "12px",
        backgroundColor: "#727272",
        color: "#ffffff",
        borderRadius: "5px",
        width: "auto",
        maxWidth: "100%",
        height: "auto",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        widthType: "auto",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        minHeight: "0px",
        alignType: "center",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    image: {
        width: "100%",
        maxWidth: "100%",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    icon: {
        width: "100px",
        maxWidth: "100%",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    text: {
        width: '100%',
        maxWidth: "100%",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        textShadow: '0px 0px 0px rgba(0,0,0,0)',
        rotate: "0deg",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    col: {
        width: '100%',
        maxWidth: "100%",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        boxShadow: "none",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start"
    },
    block: {
        width: '100%',
        maxWidth: "100%",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    input: {
        width: "100%",
        maxWidth: "100%",
        height: "35px",
        maxWidth: "100%",
        borderRadius: "5px",
        boxShadow: "none",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingRight: "10px",
        paddingLeft: "10px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "0px",
        marginLeft: "0px",
        bgType: "solid",
        borderWidth: "1px 1px 1px 1px",
        defBorderWidth: "1px",
        borderColor: "rgba(0,0,0,0.5)",
        borderStyle: "solid",
        borderType: "full",
        borderTopLeftRadius: "3px",
        borderTopRightRadius: "3px",
        borderBottomRightRadius: "3px",
        borderBottomLeftRadius: "3px",
        minHeight: "0px",
        alignType: "center",
        widthType: "auto",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    offer: {
        backgroundColor: "rgba(255,255,255,1)",
        maxWidth: "100%",
        bgType: "solid",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginBottom: "0px",
        marginRight: "auto",
        marginLeft: "auto",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "0px",
        borderColor: "rgba(0,0,0,1)",
        borderStyle: "solid",
        borderType: "none",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        maxWidth: "100%",
        maxHeight: "300px",
        overflow: "auto",
        boxShadow: "none",
        boxSizing: "border-box"
    },
    tnc: {
        width: "100%",
        maxWidth: "100%",
        borderRadius: "5px",
        boxShadow: "none",
        paddingTop: "0px",
        paddingBottom: "0px",
        paddingRight: "0px",
        paddingLeft: "0px",
        margin: "auto",
        bgType: "solid",
        borderWidth: "0px 0px 0px 0px",
        defBorderWidth: "1px",
        borderColor: "rgba(0,0,0,0.5)",
        borderStyle: "solid",
        borderType: "full",
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        minHeight: "0px",
        alignType: "center",
        widthType: "auto",
        boxShadow: "none",
        boxSizing: "border-box",
        display: "flex",
        gap: "10px",
        alignItems: "start",
        justifyContent: "start",
        alignItems: "center"
    }
}

// const defaultValue = [
//     {
//         id: 1,
//         col: 1,
//         style: {
//             width: "100%",
//             paddingTop: "0px",
//             paddingBottom: "0px",
//             paddingRight: "0px",
//             paddingLeft: "0px",
//             marginTop: "0px",
//             marginBottom: "0px",
//             marginRight: "0px",
//             marginLeft: "0px",
//             bgType: "solid",
//             borderWidth: "0px",
//             defBorderWidth: "0px",
//             borderColor: "rgba(0,0,0,1)",
//             borderStyle: "solid",
//             borderType: "none",
//             borderTopLeftRadius: "0px",
//             borderTopRightRadius: "0px",
//             borderBottomRightRadius: "0px",
//             borderBottomLeftRadius: "0px",
//             boxSizing: "border-box"
//         },
//         elements: [
//             {
//                 positionType: "left",
//                 style: {
//                     width: "33.333333333333336%",
//                     paddingTop: "1px",
//                     paddingBottom: "10px",
//                     paddingRight: "10px",
//                     paddingLeft: "10px",
//                     marginTop: "0px",
//                     marginBottom: "0px",
//                     marginRight: "0px",
//                     marginLeft: "0px",
//                     bgType: "solid",
//                     borderWidth: "0px 0px 0px 0px",
//                     defBorderWidth: "0px",
//                     borderColor: "rgba(0,0,0,1)",
//                     borderStyle: "solid",
//                     borderType: "none",
//                     borderTopLeftRadius: "0px",
//                     borderTopRightRadius: "0px",
//                     borderBottomRightRadius: "0px",
//                     borderBottomLeftRadius: "0px",
//                     boxSizing: "border-box"
//                 },
//                 element: [
//                     {
//                         label: "",
//                         class: "",
//                         option: [
//                             {
//                                 value: "1",
//                                 label: "Option 1"
//                             },
//                             {
//                                 value: "2",
//                                 label: "Option 2"
//                             }
//                         ],
//                         src: "https://superleads-widgets-images.s3.amazonaws.com/XIdS1AC0wE99.png",
//                         textValue: "<p>Enter Text</p>",
//                         isRequired: false,
//                         hasLabel: false,
//                         inputType: "email",
//                         placeholder: "Email",
//                         labelText: "Email",
//                         redirectType: "nextPage",
//                         redirectTo: "",
//                         type: "image",
//                         id: 0,
//                         style: {}
//                     }
//                 ]
//             },
//             {
//                 positionType: "right",
//                 style: {
//                     width: "66.66666666666667%",
//                     paddingTop: "65px",
//                     paddingBottom: "65px",
//                     paddingRight: "10px",
//                     paddingLeft: "10px",
//                     marginTop: "0px",
//                     marginBottom: "0px",
//                     marginRight: "0px",
//                     marginLeft: "0px",
//                     bgType: "solid",
//                     borderWidth: "0px",
//                     defBorderWidth: "0px",
//                     borderColor: "rgba(0,0,0,1)",
//                     borderStyle: "solid",
//                     borderType: "none",
//                     borderTopLeftRadius: "12px",
//                     borderTopRightRadius: "12px",
//                     borderBottomRightRadius: "12px",
//                     borderBottomLeftRadius: "12px",
//                     backgroundColor: "rgba(237,182,115,1)",
//                     backgroundImage: "none",
//                     boxShadow: "0px 0px 0px 0px    rgba(0,0,0,1)",
//                     boxSizing: "border-box"
//                 },
//                 element: [
//                     {
//                         label: "",
//                         class: "",
//                         src: "",
//                         textValue: "<div style=\"text-align: center\"><span style=\"font-size: 24px\"><strong>Become an Instant VIP. Unlock Exclusive Offers!</strong></span><br></div>",
//                         isRequired: false,
//                         hasLabel: false,
//                         inputType: "email",
//                         placeholder: "Email",
//                         labelText: "Email",
//                         redirectType: "nextPage",
//                         redirectTo: "",
//                         type: "text",
//                         style: {
//                             width: "100%",
//                             paddingTop: "",
//                             paddingBottom: "",
//                             paddingRight: "",
//                             paddingLeft: "",
//                             marginTop: "",
//                             marginBottom: "",
//                             marginRight: "",
//                             marginLeft: "",
//                             bgType: "solid",
//                             borderWidth: "0px",
//                             defBorderWidth: "0px",
//                             borderColor: "rgba(0,0,0,1)",
//                             borderStyle: "solid",
//                             borderType: "none",
//                             borderTopLeftRadius: "0px",
//                             borderTopRightRadius: "0px",
//                             borderBottomRightRadius: "0px",
//                             borderBottomLeftRadius: "0px",
//                             textShadow: "0px 0px 0px rgba(0,0,0,0)",
//                             rotate: "0deg",
//                             backgroundColor: "rgba(255,255,255,0)",
//                             backgroundImage: "none",
//                             boxShadow: "0px 0px 0px 0px  rgba(0,0,0,1)",
//                             boxSizing: "border-box"
//                         }
//                     },
//                     {
//                         label: "",
//                         class: "",
//                         src: "",
//                         textValue: "<p style=\"text-align: center\"><span style=\"font-size: 14px\">Our instant VIPs get discounts you won't find anywhere else! Check in to see what's waiting for you.</span><br></p>",
//                         isRequired: false,
//                         hasLabel: false,
//                         inputType: "email",
//                         placeholder: "Email",
//                         labelText: "Email",
//                         redirectType: "nextPage",
//                         redirectTo: "",
//                         type: "text",
//                         style: {
//                             width: "100%",
//                             paddingTop: "25px",
//                             paddingBottom: "25px",
//                             paddingRight: "",
//                             paddingLeft: "",
//                             marginTop: "0px",
//                             marginBottom: "0px",
//                             marginRight: "0px",
//                             marginLeft: "0px",
//                             bgType: "solid",
//                             borderWidth: "0px",
//                             defBorderWidth: "0px",
//                             borderColor: "rgba(0,0,0,1)",
//                             borderStyle: "solid",
//                             borderType: "none",
//                             borderTopLeftRadius: "0px",
//                             borderTopRightRadius: "0px",
//                             borderBottomRightRadius: "0px",
//                             borderBottomLeftRadius: "0px",
//                             textShadow: "0px 0px 0px rgba(0,0,0,0)",
//                             rotate: "0deg",
//                             boxSizing: "border-box"
//                         }
//                     },
//                     {
//                         label: "",
//                         class: "",
//                         src: "",
//                         textValue: "<p>Check In!<br></p>",
//                         isRequired: false,
//                         hasLabel: false,
//                         inputType: "email",
//                         placeholder: "Email",
//                         labelText: "Email",
//                         redirectType: "nextPage",
//                         redirectTo: "",
//                         type: "button",
//                         style: {
//                             fontSize: "12px",
//                             backgroundColor: "rgba(70,70,70,1)",
//                             color: "#ffffff",
//                             borderRadius: "5px",
//                             width: "151px",
//                             maxWidth: "100%",
//                             height: "auto",
//                             paddingTop: "18px",
//                             paddingBottom: "18px",
//                             paddingRight: "18px",
//                             paddingLeft: "18px",
//                             marginTop: "0px",
//                             marginBottom: "0px",
//                             marginRight: "0px",
//                             marginLeft: "0px",
//                             bgType: "solid",
//                             widthType: "custom",
//                             borderWidth: "0px",
//                             defBorderWidth: "0px",
//                             borderColor: "rgba(0,0,0,1)",
//                             borderStyle: "solid",
//                             borderType: "none",
//                             borderTopLeftRadius: "6px",
//                             borderTopRightRadius: "6px",
//                             borderBottomRightRadius: "6px",
//                             borderBottomLeftRadius: "6px",
//                             minHeight: "0px",
//                             alignType: "center",
//                             textShadow: "0px 0px 0px rgba(0,0,0,0)",
//                             rotate: "0deg",
//                             backgroundImage: "none",
//                             padding: "10px",
//                             boxShadow: "0px 0px 0px 0px  rgba(0,0,0,1)",
//                             boxSizing: "border-box"
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         id: 2,
//         col: 1,
//         style: {
//             width: "100%",
//             paddingTop: "0px",
//             paddingBottom: "0px",
//             paddingRight: "0px",
//             paddingLeft: "0px",
//             marginTop: "0px",
//             marginBottom: "0px",
//             marginRight: "0px",
//             marginLeft: "0px",
//             bgType: "solid",
//             borderWidth: "0px 0px 0px 0px",
//             defBorderWidth: "0px",
//             borderColor: "rgba(0,0,0,1)",
//             borderStyle: "solid",
//             borderType: "none",
//             borderTopLeftRadius: "0px",
//             borderTopRightRadius: "0px",
//             borderBottomRightRadius: "0px",
//             borderBottomLeftRadius: "0px",
//             boxSizing: "border-box"
//         },
//         elements: [
//             {
//                 positionType: "left",
//                 style: {
//                     width: "100%",
//                     paddingTop: "0px",
//                     paddingBottom: "0px",
//                     paddingRight: "0px",
//                     paddingLeft: "0px",
//                     marginTop: "0px",
//                     marginBottom: "0px",
//                     marginRight: "0px",
//                     marginLeft: "0px",
//                     bgType: "solid",
//                     borderWidth: "0px",
//                     defBorderWidth: "0px",
//                     borderColor: "rgba(0,0,0,1)",
//                     borderStyle: "solid",
//                     borderType: "none",
//                     borderTopLeftRadius: "0px",
//                     borderTopRightRadius: "0px",
//                     borderBottomRightRadius: "0px",
//                     borderBottomLeftRadius: "0px",
//                     boxSizing: "border-box"
//                 },
//                 element: [
//                     {
//                         label: "",
//                         class: "",
//                         src: "",
//                         textValue: "<p class=\"ql-align-center\"><span class=\"ql-size-small\">Powered by&nbsp;XIRCLS</span></p>",
//                         isRequired: false,
//                         hasLabel: false,
//                         inputType: "email",
//                         placeholder: "Email",
//                         labelText: "Email",
//                         redirectType: "nextPage",
//                         redirectTo: "",
//                         type: "text",
//                         style: {
//                             width: "100%",
//                             paddingTop: "0px",
//                             paddingBottom: "0px",
//                             paddingRight: "0px",
//                             paddingLeft: "400px",
//                             marginTop: "0px",
//                             marginBottom: "0px",
//                             marginRight: "0px",
//                             marginLeft: "0px",
//                             bgType: "solid",
//                             borderWidth: "0px",
//                             defBorderWidth: "0px",
//                             borderColor: "rgba(0,0,0,1)",
//                             borderStyle: "solid",
//                             borderType: "none",
//                             borderTopLeftRadius: "0px",
//                             borderTopRightRadius: "0px",
//                             borderBottomRightRadius: "0px",
//                             borderBottomLeftRadius: "0px",
//                             textShadow: "0px 0px 25px rgba(0,0,0,1.0)",
//                             rotate: "0deg",
//                             boxSizing: "border-box"
//                         }
//                     }
//                 ]
//             }
//         ]
//     }
// ]

export const userVerificationDefault = [
    {
        id: 1,
        col: 1,
        style: {
            width: "100%",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingRight: "10px",
            paddingLeft: "10px",
            marginTop: "0px",
            marginBottom: "0px",
            marginRight: "0px",
            marginLeft: "0px",
            bgType: "solid",
            borderWidth: "0px 0px 0px 0px",
            defBorderWidth: "0px",
            borderColor: "rgba(0,0,0,1)",
            borderStyle: "solid",
            borderType: "none",
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderBottomLeftRadius: "0px",
            boxSizing: 'border-box'
        },
        elements: [
            {
                positionType: "left",
                style: {
                    width: "100%",
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    paddingRight: "0px",
                    paddingLeft: "0px",
                    marginTop: "0px",
                    marginBottom: "0px",
                    marginRight: "0px",
                    marginLeft: "0px",
                    bgType: "solid",
                    borderWidth: "0px 0px 0px 0px",
                    defBorderWidth: "0px",
                    borderColor: "rgba(0,0,0,1)",
                    borderStyle: "solid",
                    borderType: "none",
                    borderTopLeftRadius: "0px",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    boxSizing: 'border-box'
                },
                element: [
                    {
                        label: "",
                        class: "",
                        option: [
                            {
                                value: "1",
                                label: "Option 1"
                            },
                            {
                                value: "2",
                                label: "Option 2"
                            }
                        ],
                        src: "",
                        textValue: "<p><strong class=\"ql-size-large\"><u>User Verification</u></strong></p>",
                        isRequired: false,
                        hasLabel: false,
                        inputType: "email",
                        placeholder: "Email",
                        labelText: "Email",
                        redirectType: "nextPage",
                        redirectTo: "",
                        type: "text",
                        id: 0,
                        style: {
                            width: "100%",
                            paddingTop: "0px",
                            paddingBottom: "10px",
                            paddingRight: "0px",
                            paddingLeft: "0px",
                            marginTop: "0px",
                            marginBottom: "0px",
                            marginRight: "0px",
                            marginLeft: "0px",
                            bgType: "solid",
                            borderWidth: "0px",
                            defBorderWidth: "0px",
                            borderColor: "rgba(0,0,0,1)",
                            borderStyle: "solid",
                            borderType: "none",
                            borderTopLeftRadius: "0px",
                            borderTopRightRadius: "0px",
                            borderBottomRightRadius: "0px",
                            borderBottomLeftRadius: "0px",
                            textShadow: "0px 0px 0px rgba(0,0,0,0)",
                            rotate: "0deg",
                            boxSizing: 'border-box'
                        }
                    },
                    {
                        label: "",
                        class: "",
                        src: "",
                        textValue: "<p>Enter Text</p>",
                        isRequired: false,
                        hasLabel: false,
                        inputType: "email",
                        placeholder: "Enter OTP",
                        labelText: "Email",
                        redirectType: "nextPage",
                        redirectTo: "",
                        type: "input",
                        style: {
                            width: "100%",
                            height: "35px",
                            maxWidth: "100%",
                            borderRadius: "5px",
                            boxShadow: "none",
                            paddingTop: "0px",
                            paddingBottom: "0px",
                            paddingRight: "0px",
                            paddingLeft: "0px",
                            marginTop: "0px",
                            marginBottom: "0px",
                            marginRight: "0px",
                            marginLeft: "0px",
                            bgType: "solid",
                            borderWidth: "1px 1px 1px 1px",
                            defBorderWidth: "1px",
                            borderColor: "#888a85",
                            borderStyle: "solid",
                            borderType: "full",
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                            minHeight: "0px",
                            alignType: "center",
                            widthType: "auto",
                            textShadow: "0px 0px 0px rgba(0,0,0,0)",
                            rotate: "0deg",
                            boxSizing: 'border-box'
                        }
                    }
                ]
            }
        ]
    }
]


export const defaultObj = {
    theme_name: "template_default",
    pages: [
        {
            pageName: "main",
            id: "main",
            values: []
        },
        {
            pageName: "User Verification",
            id: "user_verification",
            values: userVerificationDefault
        },
        {
            pageName: "Offer Page",
            id: "offers",
            values: []
        }
    ],
    mobile_pages: [
        {
            pageName: "main",
            id: "main",
            values: []
        },
        {
            pageName: "User Verification",
            id: "user_verification",
            values: userVerificationDefault
        },
        {
            pageName: "Offer Page",
            id: "offers",
            values: []
        }
    ],
    button: [
        {
            id: 1,
            col: 1,
            style: elementStyles.block,
            elements: [
                {
                    positionType: "left",
                    style: elementStyles.col,
                    element: [{ ...commonObj, type: "text", style: elementStyles.text }]
                }
            ]
        }
    ],
    behaviour: {
        visitor_settings: "ALL_VISITORS",
        pop_up_load_type: "scroll",
        pop_up_load_value: 0,
        PAGES: ['all_pages'],
        CUSTOM_PAGE_LINK: [""],
        otp_settings: 1
    },
    positions: {
        main: "MC",
        button: "BL"
    },
    crossButtons: {
        main: { width: "25px", height: "25px", borderRadius: 0, backgroundColor: "rgba(115,103,240,1)", color: "rgba(0,0,0,1)", translateX: "0px", translateY: "0px" },
        button: {},
        mobile_main: { width: "25px", height: "25px", borderRadius: 0, backgroundColor: "rgba(115,103,240,1)", color: "rgba(0,0,0,1)", translateX: "0px", translateY: "0px" },
        mobile_button: {}
    },
    backgroundStyles: {
        main: { backgroundColor: "rgba(255,255,255,1)", bgType: "solid", width: '550px', maxWidth: "90%", minHeight: '75px', paddingTop: "0px", paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px", marginTop: "0px", marginBottom: "0px", marginRight: "0px", marginLeft: "0px", borderWidth: "0px 0px 0px 0px", defBorderWidth: "0px", borderColor: "rgba(0,0,0,1)", borderStyle: "solid", borderType: "none", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px" },
        button: { backgroundColor: "rgba(255,255,255,1)", bgType: "solid", width: '300px', maxWidth: "100%", minHeight: '50px', paddingTop: "0px", paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px", marginTop: "0px", marginBottom: "0px", marginRight: "0px", marginLeft: "0px", borderWidth: "0px 0px 0px 0px", defBorderWidth: "0px", borderColor: "rgba(0,0,0,1)", borderStyle: "solid", borderType: "none", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px" },
        mobile_main: { backgroundColor: "rgba(255,255,255,1)", bgType: "solid", width: '550px', maxWidth: "90%", minHeight: '75px', paddingTop: "0px", paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px", marginTop: "0px", marginBottom: "0px", marginRight: "0px", marginLeft: "0px", borderWidth: "0px 0px 0px 0px", defBorderWidth: "0px", borderColor: "rgba(0,0,0,1)", borderStyle: "solid", borderType: "none", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px" },
        mobile_button: { backgroundColor: "rgba(255,255,255,1)", bgType: "solid", width: '300px', maxWidth: "100%", minHeight: '50px', paddingTop: "0px", paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px", marginTop: "0px", marginBottom: "0px", marginRight: "0px", marginLeft: "0px", borderWidth: "0px 0px 0px 0px", defBorderWidth: "0px", borderColor: "rgba(0,0,0,1)", borderStyle: "solid", borderType: "none", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px" }
    },
    overlayStyles: { backgroundColor: "rgba(0,0,0,0.5)", bgType: "solid", paddingTop: "0px", paddingBottom: "0px", paddingRight: "0px", paddingLeft: "0px", marginTop: "0px", marginBottom: "0px", marginRight: "0px", marginLeft: "0px", borderWidth: "0px 0px 0px 0px", defBorderWidth: "0px", borderColor: "rgba(0,0,0,1)", borderStyle: "solid", borderType: "none", borderTopLeftRadius: "0px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", boxSizing: "border-box" },
    selectedOffers: [],
    teaserEnabled: true,
    verificationEnabled: false,
    campaignStartDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    campaignHasEndDate: false,
    campaignEndDate: "",
    fontFamilies: {
        primary: "Montserrat",
        secondary: "Montserrat",
        others: "Montserrat"
    },
    defaultThemeColors: {
        primary: "#ffffff",
        secondary1: "#EDB673",
        secondary2: "#020202",
        secondary3: "#ffffff",
        secondary4: "#000000"
    }
}