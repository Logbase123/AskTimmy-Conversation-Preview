import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./StoreConversationForm.css";
import { leftArrow } from "./assets";

export default function StoreConversationForm() {
    const [conversationId, setConversationId] = useState("");
    const [storeId, setStoreId] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/');
        setConversationId("");
        setStoreId("");
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const urlId = searchParams.get('id');
        const urlStoreId = searchParams.get('storeId');
        
        if (urlId && urlStoreId) {
            setConversationId(urlId);
            setStoreId(urlStoreId);
            setIsLoading(true);
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `https://chateasy-test.logbase.io/api/conversation?id=${urlId}&storeId=${urlStoreId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );
                    const data = await response.json();
                    console.log('Data:', data);
                    setResponseData(data.conversation);
                    setShowForm(false);
                } catch (error) {
                    console.error('Error:', error);
                    alert("Invalid conversation ID or store ID");
                    navigate('/');
                    setShowForm(true);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        } else {
            setShowForm(true);
            setResponseData(null);
            setIsLoading(false);
        }
        window.scrollTo(0, 0);
    }, [searchParams]);

    useEffect(() => {
        const chatWidget = document.querySelector('chat-widget');
        if (chatWidget && responseData) {
            window.scrollTo(0, 0);
            chatWidget.styling = {
                "appVisibility": {
                    "type": "all",
                    "urls": []
                },
                "assistant": {
                    "avatar": {
                        "type": "default-1",
                        "default": [
                            "https://lb-apps-media.s3.amazonaws.com/AskTimmy-media/default-avatar-1.png",
                            "https://lb-apps-media.s3.amazonaws.com/AskTimmy-media/default-avatar-2.png",
                            "https://lb-apps-media.s3.amazonaws.com/AskTimmy-media/default-avatar-3.png"
                        ]
                    },
                    "brandColor": "#8F4BD7",
                    "color": "#121212",
                    "bgColor": "#FFF",
                    "borderRadius": 16,
                    "user": {
                        "color": "#FFF",
                        "bgColor": "#8F4BD7"
                    },
                    "system": {
                        "color": "#121212",
                        "bgColor": "#F2F2F2"
                    },
                    "header": {
                        "color": "#121212",
                        "bgColor": "#FFF",
                        "type": "default-1"
                    },
                    "textbox": {
                        "color": "#121212",
                        "bgColor": "#ffffff",
                        "borderColor": "#d7d7d7",
                        "borderRadius": 12
                    },
                    "star": {
                        "type": "default-1",
                        "color": "#8F4BD7"
                    },
                    "send": {
                        "color": "#fff",
                        "bgColor": "#e01111"
                    },
                    "feedbackIcon": {
                        "color": "#e01111",
                        "size": 25
                    }
                },
                "nudge": {
                    "classic": {
                        "color": "#121212",
                        "bgColor": "#FFFFFF",
                        "borderColor": "#121212",
                        "borderRadius": 10
                    },
                    "footer": {
                        "color": "#121212",
                        "bgColor": "#FFFFFF",
                        "borderColor": "#121212",
                        "borderRadius": 10,
                        "star": {
                            "type": "default-1",
                            "color": "#8F4BD7"
                        },
                        "button": {
                            "color": "#121212",
                            "bgColor": "transparent",
                            "borderColor": "transparent",
                            "borderRadius": 10
                        }
                    },
                    "productPitch": {
                        "color": "#121212",
                        "bgColor": "#FFFFFF",
                        "borderRadius": 10
                    }
                },
                "conversationStarter": {
                    "color": "#121212",
                    "bgColor": "#ffffff",
                    "borderColor": "#c8c8c8"
                },
                "launcher": {
                    "classic": {
                        "position": {
                            "horizontal": "right",
                            "bottom": 20,
                            "rightORLeft": 24
                        },
                        "type": "default-1",
                        "bgColor": "#8F4BD7",
                        "hideGreenDot": true,
                        "isEnabled": true
                    },
                    "quickInput": {
                        "position": {
                            "isCustomPositionEnabled": false,
                            "desktop": {
                                "elementSelectorPosition": "beforebegin"
                            },
                            "mobile": {
                                "elementSelectorPosition": "beforebegin"
                            }
                        },
                        "star": {
                            "type": "default-1",
                            "color": "#8F4BD7"
                        },
                        "send": {
                            "color": "#ffffff",
                            "bgColor": "#8F4BD7"
                        },
                        "textbox": {
                            "color": "#121212",
                            "bgColor": "#ffffff",
                            "borderColor": "#d7d7d7",
                            "borderRadius": 12
                        },
                        "borderRadius": 12,
                        "bgColor": "#F9F9F9",
                        "titleColor": "#121212",
                        "isEnabled": true
                    },
                    "toggle": {
                        "position": {
                            "isCustomPositionEnabled": false,
                            "desktop": {
                                "elementSelectorPosition": "beforebegin"
                            },
                            "mobile": {
                                "elementSelectorPosition": "beforebegin"
                            }
                        },
                        "star": {
                            "type": "default-1",
                            "color": "#8F4BD7"
                        },
                        "label": {
                            "color": "#121212"
                        },
                        "bgColor": "transparent",
                        "borderColor": "#121212",
                        "borderRadius": 10,
                        "isEnabled": true
                    }
                }
            };
            chatWidget.chatView = "slide";
            chatWidget.translation = {
                "assistant": {
                    "title": "AskTimmy.ai",
                    "subTitle": "Your Ai Assistant",
                    "description": "I can help you with product queries, or discover right products.",
                    "welcomeMessage": "Welcome to our store",
                    "currentPageContextMessage": "Now you are on {{pageName}} page",
                    "questionAboutProductMessage": "Ask me anything about this product",
                    "viewProduct": "View Product",
                    "endChat": "End Chat",
                    "cancel": "Cancel",
                    "endChatMessage": "Are you sure want to end the chat?",
                    "close": "Close",
                    "waitingMessage": "Your previous message is being processed. Please wait before sending the next message.",
                    "placeholder": "Ask me anything"
                },
                "launcher": {
                    "quickInput": {
                        "title": "Ask AI for expert suggestions",
                        "textbox": {
                            "placeholder": "Ask me anything"
                        }
                    },
                    "toggle": {
                        "label": {}
                    }
                },
                "photoSearch": {
                    "title": "Find with photo",
                    "dragAndDropText": "Click to upload, or drag & drop the image here.",
                    "recommendedFormats": "JPEG, JPG, PNG recommended, up to 5 MB.",
                    "invalidFileType": "Invalid file type, select JPEG, JPG or PNG.",
                    "fileSizeLarge": "File size exceeds the limit of 5MB.",
                    "illustrationTitle": "Ask questions with a photo",
                    "questionAboutPhotoMessage": "Let us know what you want."
                },
                "bundleProducts": {
                    "title": "Check out these recommendations!",
                    "description": "Get a discount when you buy more than one product",
                    "total": "Total",
                    "addToCart": "Add selected items to cart",
                    "addedToCart": "Selected {{count}} items added to cart",
                    "showMore": "Show more",
                    "showLess": "Show less"
                },
                "nudge": {
                    "footer": {
                        "button": {
                            "text": "Ask Ai"
                        }
                    }
                },
                "feedback": {
                    "thumbsUpTooltip": "Helpful",
                    "thumbsDownTooltip": "Not helpful",
                    "predefinedResponses": [
                        "Not helpful",
                        "Response was not clear",
                        "Didn't answer my question"
                    ],
                    "responseTitle": "What went wrong?",
                    "thankYouMessage": "Thank you for your feedback!",
                    "feedbackPlaceholder": "Please share your feedback"
                }
            };
            chatWidget.isAdmin = true;
            chatWidget.isSimulator = false;
            chatWidget.isFeedbackCaptured = false;
            chatWidget.isFeedbackSubmitted = false;
            chatWidget.isVoiceInputEnabled = false;
            chatWidget.voiceInputLanguage = "en";
            chatWidget.isLocaleChanged = false;
            chatWidget.shopCurrencyFormats = {
                "moneyFormat": "${{amount}}",
                "moneyInEmailsFormat": "${{amount}}",
                "moneyWithCurrencyFormat": "${{amount}} USD",
                "moneyWithCurrencyInEmailsFormat": "${{amount}} USD"
            };
            
            chatWidget.messages = responseData;
            chatWidget.storeId = storeId;
            window.scrollTo(0, 0);
        }
    }, [responseData]);

    const handleSubmit = () => {
        if (conversationId && storeId) {
            setSearchParams({ id: conversationId, storeId: storeId });
            window.scrollTo(0, 0);
        }
    };
    
    return (
        <div>
            {showForm && !searchParams.get('id') && !searchParams.get('storeId') && (
                <div className="form">
                    <div className="pattern-overlay"></div>
                    <div className="header-section">
                        <h1>AskTimmy.ai<br />Conversation preview</h1>
                        <p>View and analyze your conversation details</p>
                    </div>
                    <div className="form-container">
                        <form className="form-content">
                            <div className="form-group">
                                <label>Store ID</label>
                                <input
                                    type="text"
                                    value={storeId}
                                    onChange={(e) => setStoreId(e.target.value)}
                                    placeholder="Enter your store ID"
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Conversation ID</label>
                                <input
                                    type="text"
                                    value={conversationId}
                                    onChange={(e) => setConversationId(e.target.value)}
                                    placeholder="Enter your conversation ID"
                                    required
                                    className="form-input"
                                />
                            </div>
                            <button 
                                type="button" 
                                className="submit-button" 
                                disabled={!conversationId || !storeId || isLoading}
                                onClick={() => {
                                    handleSubmit(); 
                                    setSearchParams({ id: conversationId, storeId: storeId });
                                }}
                            >
                                {isLoading ? 'Loading...' : 'View Conversation'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading conversation...</p>
                </div>
            )}
            
            {responseData && !showForm && !isLoading && ( 
                <div className="chat-page">
                    <div className="background-design">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="wave-pattern"></div>
                    </div>
                    <div className="content-wrapper">
                        <div className="back-button">
                            <button onClick={handleBack} className="back-button">
                                <img src={leftArrow} alt="Back" className="back-arrow" />
                                <span className="back-button-text">Back</span>
                            </button>
                        </div>
                        <div className="chat-history">
                            <chat-widget class="chat-widget-container"></chat-widget>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
