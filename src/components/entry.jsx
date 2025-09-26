import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, data } from "react-router-dom";
import "./StoreConversationForm.css";
import { leftArrow, copy, checkCircle } from "./assets";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { enUS } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import 'chat-widget';

function formatDate(epoch) {
    if (!epoch) return '-';
    const d = new Date(Number(epoch));
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function setupChatWidget(messages, storeId) {
    const pageInfo= document.querySelector('.askTimmy-current-page-info');
    if(pageInfo){
        pageInfo.remove();
    }
    const chatWidget = document.querySelector('chat-widget');
    // Delete all props
    if (chatWidget) {
        chatWidget.messages = null;
        chatWidget.storeId = null;
        chatWidget.styling = null;
        chatWidget.translation = null;
    }
    console.log('chatWidget', chatWidget);
    if (chatWidget) {
        chatWidget.messages = messages;
        chatWidget.storeId = storeId;
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
            const title= messages[0]?.title;
            const currentPageUrl = messages[0]?.currentPageUrl;
            if (currentPageUrl && title) {
                // Remove existing current page info div if it exists
                const existingDiv = chatWidget.querySelector('.askTimmy-chat-assistant-info');
                
                // Create new current page info div
                const currentPageDiv = document.createElement('div');
                currentPageDiv.className = 'askTimmy-current-page-info';
                currentPageDiv.innerHTML = `<span class="front-line line"></span><span class="info"><a href="${currentPageUrl}" style="color: #333333; text-decoration: none;" target="_blank">Now you are on ${title} page</a></span><span class="end-line line"></span>`;
                if(existingDiv){
                    existingDiv.insertAdjacentElement('afterend', currentPageDiv);
                }
            }
        
        window.scrollTo(0, 0);
    }
}
export default function StoreConversationForm() {
    const [conversationId, setConversationId] = useState("");
    const [storeId, setStoreId] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isCopiedId, setIsCopiedId] = useState(false);
    const [isCopiedStoreId, setIsCopiedStoreId] = useState(false);
    const [activeTab, setActiveTab] = useState('conversation');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const [isCopiedStoreIdDateTab, setIsCopiedStoreIdDateTab] = useState(false);
    const [isCopiedStartEpoch, setIsCopiedStartEpoch] = useState(false);
    const [isCopiedEndEpoch, setIsCopiedEndEpoch] = useState(false);
    const [history, setHistory] = useState([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
    const chatHistoryRef = useRef(null);

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
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('API error:', errorText);
                        throw new Error('API error');
                    }
                    const data = await response.json();
                    console.log('Data:', data);
                    setResponseData({
                        conversation: data.conversation,
                        isSubscribed: data.isSubscribed,
                        isUninstalled: data.isUninstalled,
                        aiCount: data.aiCount,
                        userCount: data.userCount,
                        conversationCount: data.conversationCount,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt
                    });
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
    }, [searchParams, navigate]);


    const handleSubmit = async () => {
        if (conversationId && storeId) {
            setSearchParams({ id: conversationId, storeId: storeId });
            window.scrollTo(0, 0);
        }
    };

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

            chatWidget.messages = responseData.conversation;
            chatWidget.storeId = storeId;
            window.scrollTo(0, 0);
        }
    }, [responseData, storeId]);

    useEffect(() => {
        if (activeTab === 'date' && history.length > 0) {
            const messages = history[currentHistoryIndex]?.conversation || [];
            setupChatWidget(messages, storeId);
        }
    }, [history, currentHistoryIndex, activeTab, storeId]);

    useEffect(() => {
        if (responseData && responseData.conversation && activeTab === 'conversation') {
            setupChatWidget(responseData.conversation, storeId);
            window.scrollTo(0, 0);
        }
    }, [responseData, storeId, activeTab]);

    // const handleSubmit = () => {
    //     if (conversationId && storeId) {
    //         setSearchParams({ id: conversationId, storeId: storeId });
    //         window.scrollTo(0, 0);
    //     }
    // };

    const handleDateRangeSubmit = async () => {
        const diffDays = differenceInDays(dateRange[0].endDate, dateRange[0].startDate);

        if (!storeId) {
            setShowError(true);
            setErrorMessage("Enter the correct Store ID to fetch data.");
            return;
        }

        //   if (diffDays > 29) {
        //     alert("Please select a date range of 30 days or less.");
        //     return;
        //   }
        if (diffDays > 29) {
            setShowError(true);
            setErrorMessage("Please select a date range of 30 days or less.");
            return;
        }


        setShowError(false);
        setErrorMessage("");
        setIsLoading(true);

        const startOfDay = new Date(dateRange[0].startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateRange[0].endDate);
        endOfDay.setHours(23, 59, 59, 999);

        const startEpoch = startOfDay.getTime();
        const endEpoch = endOfDay.getTime();

        try {
            const response = await fetch(
                `https://chateasy-test.logbase.io/api/conversation?storeId=${storeId}&startDate=${startEpoch}&endDate=${endEpoch}&limit=500`
            );

            const text = await response.text();

            if (!response.ok) {
                if (text.includes("Invalid storeId")) {
                    setShowError(true);
                    setErrorMessage("Invalid Store ID. Please enter a valid one.");
                } else {
                    setShowError(true);
                    setErrorMessage("Unable to fetch conversations. Please check your input.");
                }
                setHistory([]);
                return;
            }

            const data = JSON.parse(text);

            if (!data.items || data.items.length === 0) {
                setHistory([]);
                setShowError(true);
                setErrorMessage("No conversations found for selected date range.");
                return;
            }

            setHistory(data.items || []);
            setCurrentHistoryIndex(0);
            setShowForm(false);
            setResponseData({
                isSubscribed: data.isSubscribed,
                isUninstalled: data.isUninstalled,
            });
        } catch (err) {
            console.error(err);
            setShowError(true);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateRangeChange = (item) => {
        const start = item.selection.startDate;
        const end = item.selection.endDate;
        const diffDays = Math.abs(differenceInDays(end, start));
        if (diffDays > 29) {
            alert('Please select a date range of 30 days or less.');
            return;
        }
        setDateRange([item.selection]);
    };

    const currentConversation = history[currentHistoryIndex]?.conversation || [];
    const allMessages = currentConversation.flatMap(c =>
        (c.messages || []).map(m => ({
            text: m.message || '',
            sender: m.isAIReply ? 'bot' : 'user',
            cards: m.cards || [],
            imageUrl: m.imageUrl || null,
            // add other fields as needed
        }))
    );

    // console.log("history:", history);
    // console.log("currentConversation:", currentConversation);
    // console.log("allMessages:", allMessages);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeTab !== 'date' || history.length <= 1) return;

            if (e.key === 'ArrowLeft' && currentHistoryIndex > 0) {
                setCurrentHistoryIndex(prev => prev - 1);
                setTimeout(scrollChatToTop, 150);
            }

            if (e.key === 'ArrowRight' && currentHistoryIndex < history.length - 1) {
                setCurrentHistoryIndex(prev => prev + 1);
                setTimeout(scrollChatToTop, 150);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, currentHistoryIndex, history.length]);

    const scrollChatToTop = () => {
        let tries = 0;

        const tryScroll = () => {
            const scrollable = document.querySelector('.askTimmy-chat-window');
            if (scrollable) {
                scrollable.scrollTo({ top: 0 });
                // Check if the scroll position is at the top
                if (scrollable.scrollTop > 0 && tries < 10) {
                    tries++;
                    requestAnimationFrame(tryScroll);
                }
            } else if (tries < 10) {
                tries++;
                requestAnimationFrame(tryScroll);
            }
        };

        requestAnimationFrame(tryScroll);
    };

    const isUninstalled = responseData?.isUninstalled;
    const isSubscribed = responseData?.isSubscribed;

    const getConversationStats = (messages = []) => {
        let userCount = 0, aiCount = 0, total = 0;

        messages.forEach(msg => {
            if (!msg) return;

            const isAI = msg.isAIReply === true || msg.type === 'system' || msg.sender === 'bot';
            const isUser = !isAI;

            if (isAI) aiCount++;
            else if (isUser) userCount++;

            total++;
        });

        return { userCount, aiCount, conversationCount: total };
    };

    const extractMessages = (data, tab) => {
        console.log('data', data);
        if (tab === 'conversation') {
            return Array.isArray(data?.conversation)
                ? data.conversation
                : [];
        }
        if (tab === 'date') {
            return data?.[currentHistoryIndex]?.conversation?.flatMap(c => c.messages || []) || [];
        }
        return [];
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);


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
                        <div style={{ display: 'flex', marginBottom: 24 }}>
                            <button
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    border: 'none',
                                    borderBottom: activeTab === 'conversation' ? '2px solid #8f4bd7' : '2px solid #e2e8f0',
                                    background: 'transparent',
                                    fontWeight: activeTab === 'conversation' ? 'bold' : 'normal',
                                    color: activeTab === 'conversation' ? '#8f4bd7' : '#64748b',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('conversation')}
                            >
                                By Conversation ID
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    border: 'none',
                                    borderBottom: activeTab === 'date' ? '2px solid #8f4bd7' : '2px solid #e2e8f0',
                                    background: 'transparent',
                                    fontWeight: activeTab === 'date' ? 'bold' : 'normal',
                                    color: activeTab === 'date' ? '#8f4bd7' : '#64748b',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('date')}
                            >
                                By Date
                            </button>
                        </div>

                        {activeTab === 'conversation' && (
                            <form className="form-content">
                                {showError && (
                                    <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>
                                )}
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
                                    onClick={async () => {
                                        const success = await handleSubmit(); // 👈 awaits validation + API
                                        if (success) {
                                            setSearchParams({ id: conversationId, storeId: storeId }); // 👈 only when valid
                                        }
                                    }}
                                >
                                    {isLoading ? 'Loading...' : 'View Conversation'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'date' && (
                            <form className="form-content">
                                {showError && (
                                    <div style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</div>
                                )}
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
                                    <label>Date Range</label>
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRange}
                                        locale={enUS}
                                        maxDate={new Date()}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="submit-button"
                                    disabled={!storeId}
                                    onClick={handleDateRangeSubmit}
                                >
                                    {isLoading ? 'Loading...' : 'View Conversations'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading conversation...</p>
                </div>
            )}

            {responseData && !showForm && !isLoading && activeTab === 'conversation' && (
                <div className="chat-page">
                    <div className="background-design">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="wave-pattern"></div>
                    </div>
                    <div className="content-wrapper">
                        <div className="back-button">
                            <button onClick={() => {
                                handleBack();
                                setIsCopiedId(false);
                                setIsCopiedStoreId(false);
                            }} className="back-button">
                                <img src={leftArrow} alt="Back" className="back-arrow" />
                                <span className="back-button-text">Back</span>
                            </button>
                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
                            {/* Left: Chat history */}
                            <div style={{
                                flex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                flexWrap: 'wrap'
                            }}>
                                <div
                                    className="chat-history"
                                    ref={chatHistoryRef}
                                    style={{
                                        margin: '0 auto',
                                        background: '#fff',
                                        borderRadius: 16,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        // maxWidth: 900,
                                        minWidth: 700,
                                        width: '100%',
                                        padding: 0,
                                        minHeight: 300,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <chat-widget className="chat-widget-container"></chat-widget>
                                </div>
                            </div>
                            {/* Right: ID display */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 8,
                                flexWrap: 'wrap'
                            }}>
                                <div className="id-display-container2"
                                    style={{
                                        margin: '0 auto',
                                        minWidth: 320,
                                        maxWidth: 400,
                                        padding: 16,
                                        borderRadius: 16,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        background: '#fff',
                                        fontSize: 13,
                                        gap: 8,

                                    }}>
                                    <h3>Store Details</h3>
                                    <div className="id-display-row">
                                        <span className="id-label">Store ID:</span>
                                        <span >{storeId}</span>
                                        <button className="copy-button" onClick={() => {
                                            navigator.clipboard.writeText(storeId);
                                            setIsCopiedStoreIdDateTab(true);
                                            setTimeout(() => setIsCopiedStoreIdDateTab(false), 2000);
                                        }}>
                                            <img src={isCopiedStoreIdDateTab ? checkCircle : copy} alt="Copy" className="copy-icon" />
                                        </button>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">Subscribed:</span>
                                        <span >
                                            {isSubscribed ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">Uninstalled:</span>
                                        <span >
                                            {isUninstalled ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="id-display-container2"
                                    style={{
                                        minWidth: 320,
                                        maxWidth: 400,
                                        padding: 16,
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        background: '#fff',
                                        fontSize: 13,
                                        marginTop: 8,
                                        rowGap: 8,
                                        // alignItems: "center",
                                        // flexWrap : 'wrap'
                                    }}>
                                    <h3>Conversation Summary</h3>
                                    {(() => {
                                        const messages = extractMessages(responseData, activeTab); // already defined in your code
                                        const { userCount, aiCount, conversationCount } = getConversationStats(messages);
                                        return (
                                            <>
                                                <div className="id-display-row">
                                                    <span className="id-label">Convo ID:</span>
                                                    <span style={{ wordBreak: 'break-all', flex: 1 }}>{conversationId || '-'}</span>
                                                    <button className="copy-button" onClick={() => {
                                                        if (conversationId) {
                                                            navigator.clipboard.writeText(conversationId);
                                                            setIsCopiedId(true);
                                                            setTimeout(() => setIsCopiedId(false), 2000);
                                                        }
                                                    }}>
                                                        <img src={isCopiedId ? checkCircle : copy} alt="Copy" className="copy-icon" />
                                                    </button>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">User Messages:</span>
                                                    <span>{userCount || 0}</span>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">AI Replies:</span>
                                                    <span>{aiCount || 0}</span>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">Total Messages:</span>
                                                    <span>{conversationCount || 0}</span>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">Created At:</span>
                                                    <span>{formatDate(responseData.createdAt)}</span>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">Updated At:</span>
                                                    <span>{formatDate(responseData.updatedAt)}</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {responseData && !showForm && !isLoading && Array.isArray(responseData) && responseData.length > 0 && activeTab === 'date' && (
                <div className="conversation-list" style={{ margin: '24px 0' }}>
                    <h3>Conversations found:</h3>
                    {responseData.map((chat, idx) => (
                        <div key={chat.id || idx} style={{ marginBottom: 32 }}>
                            <div className="id-display-container-wrapper">
                                <div className="id-display-container">
                                    <div className="id-display-row">
                                        <span className="id-label">Conversation ID:</span>
                                        <span className="id-value">{chat.id}</span>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">Store ID:</span>
                                        <span className="id-value">{storeId}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="chat-history">
                                <div>
                                    {chat.messages.map((msg, idx) => (
                                        <div key={idx}>
                                            <b>{msg.sender}:</b> {msg.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!isLoading && !showForm && activeTab === 'conversation' && !responseData && (
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    No conversation found for the given ID and Store.
                </div>
            )}
            {activeTab === 'date' && !showForm && (
                <div className="chat-page">
                    <div className="background-design">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                        <div className="wave-pattern"></div>
                    </div>
                    <div className="content-wrapper">
                        <div className="back-button">
                            <button onClick={() => {
                                handleBack();
                                setIsCopiedStoreIdDateTab(false);
                                setIsCopiedStartEpoch(false);
                                setIsCopiedEndEpoch(false);
                            }} className="back-button">
                                <img src={leftArrow} alt="Back" className="back-arrow" />
                                <span className="back-button-text">Back</span>
                            </button>

                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'columns', alignItems: 'flex-start', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
                            {/* Left: Navigation buttons above chat history */}
                            <div style={{
                                flex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                flexWrap: 'wrap'
                            }}>
                                <div

                                    className="chat-history"
                                    ref={chatHistoryRef}
                                    style={{
                                        margin: '0 auto',
                                        background: '#fff',
                                        borderRadius: 16,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        minWidth: 700,
                                        // maxWidth: 900,
                                        width: '100%',
                                        padding: 0,
                                        minHeight: 300,
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // flexwrap:'wrap',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {history.length === 0 && (
                                        <div style={{ color: 'red', padding: 24, width: '100%', textAlign: 'center' }}>No conversation data found for this date range.</div>
                                    )}
                                    {history.length > 0 && (
                                        <chat-widget class="chat-widget-container"></chat-widget>
                                    )}
                                </div>
                                {history.length > 1 && (
                                    <div style={{ display: 'flex', gap: 4, margin: '16px auto 0 auto', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                                        <button
                                            className="left-arrow-button"
                                            style={{ background: 'none', border: 'none', cursor: currentHistoryIndex === 0 ? 'not-allowed' : 'pointer', padding: 4, opacity: currentHistoryIndex === 0 ? 0.5 : 1 }}

                                            onClick={() => {
                                                if (currentHistoryIndex > 0) {
                                                    setCurrentHistoryIndex(prev => prev - 1);
                                                    setTimeout(scrollChatToTop, 150);
                                                }
                                            }}

                                            disabled={currentHistoryIndex === 0}
                                        >
                                            <img src={leftArrow} alt="Previous Conversation" style={{ width: 22, height: 22, filter: 'grayscale(100%) brightness(0)' }} />
                                        </button>
                                        <span style={{ alignSelf: 'center', minWidth: 50, textAlign: 'center', fontWeight: 500 }}>
                                            {history.length > 0 ? `${currentHistoryIndex + 1} / ${history.length}` : '0 / 0'}
                                        </span>
                                        <button
                                            className="right-arrow-button"
                                            style={{ background: 'none', border: 'none', cursor: currentHistoryIndex === history.length - 1 ? 'not-allowed' : 'pointer', padding: 4, opacity: currentHistoryIndex === history.length - 1 ? 0.5 : 1 }}

                                            onClick={() => {
                                                if (currentHistoryIndex < history.length - 1) {
                                                    setCurrentHistoryIndex(prev => prev + 1);
                                                    setTimeout(scrollChatToTop, 150);
                                                }
                                            }}

                                            disabled={currentHistoryIndex === history.length - 1}
                                        >
                                            <img src={leftArrow} alt="Next Conversation" style={{ width: 22, height: 22, transform: 'rotate(180deg)', filter: 'grayscale(100%) brightness(0)' }} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Right: ID display */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 8,
                                flexWrap: 'wrap'
                            }}>
                                <div className="id-display-container2"
                                    style={{
                                        margin: '0 auto',
                                        minWidth: 320,
                                        maxWidth: 400,
                                        padding: 16,
                                        borderRadius: 16,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        background: '#fff',
                                        fontSize: 13,
                                        gap: 8,

                                    }}>
                                    <h3>Store Details</h3>
                                    <div className="id-display-row">
                                        <span className="id-label">Store ID:</span>
                                        <span >{storeId}</span>
                                        <button className="copy-button" onClick={() => {
                                            navigator.clipboard.writeText(storeId);
                                            setIsCopiedStoreIdDateTab(true);
                                            setTimeout(() => setIsCopiedStoreIdDateTab(false), 2000);
                                        }}>
                                            <img src={isCopiedStoreIdDateTab ? checkCircle : copy} alt="Copy" className="copy-icon" />
                                        </button>
                                    </div>

                                    <div className="id-display-row">
                                        <span className="id-label">Start Date:</span>
                                        <span >{formatDate(dateRange[0].startDate.getTime())}</span>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">End Date:</span>
                                        <span >{formatDate(dateRange[0].endDate.getTime())}</span>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">Subscribed:</span>
                                        <span >
                                            {isSubscribed ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    <div className="id-display-row">
                                        <span className="id-label">Uninstalled:</span>
                                        <span >
                                            {isUninstalled ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                {/* New: Conversation Stats Container */}
                                <div className="id-display-container2"
                                    style={{
                                        minWidth: 320,
                                        maxWidth: 400,
                                        padding: 16,
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        background: '#fff',
                                        fontSize: 13,
                                        marginTop: 8,
                                        rowGap: 8,
                                        // alignItems: "center",
                                        // flexWrap : 'wrap'
                                    }}>
                                    <h3>Conversation Summary</h3>
                                    {(() => {
                                        console.log("history[currentHistoryIndex]:", history[currentHistoryIndex]);
                                        const { userCount, aiCount, conversationCount, createdAt, updatedAt } = history[currentHistoryIndex] || {};
                                        return (
                                            <>
                                                <div className="id-display-row">
                                                    <span className="id-label">Convo ID:</span>
                                                    <span style={{ wordBreak: 'break-all', flex: 1, }}>{history[currentHistoryIndex]?.id || '-'}</span>
                                                    <button className="copy-button" onClick={() => {
                                                        if (history[currentHistoryIndex]?.id) {
                                                            navigator.clipboard.writeText(history[currentHistoryIndex].id);
                                                            setIsCopiedId(true);
                                                            setTimeout(() => setIsCopiedId(false), 2000);
                                                        }
                                                    }}>
                                                        <img src={isCopiedId ? checkCircle : copy} alt="Copy" className="copy-icon" />
                                                    </button>
                                                </div>
                                                <div className="id-display-row">
                                                    <span className="id-label">User Messages:</span>
                                                    <span>{userCount || 0}</span>
                                                </div>
                                                <div className="id-display-row"><span className="id-label">AI Replies:</span> <span>{aiCount || 0}</span></div>
                                                <div className="id-display-row"><span className="id-label">Total Messages:</span> <span>{conversationCount || 0}</span></div>
                                                <div className="id-display-row"><span className="id-label">Created At:</span> <span>{formatDate(createdAt)}</span></div>
                                                <div className="id-display-row"><span className="id-label">Updated At:</span> <span>{formatDate(updatedAt)}</span></div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}