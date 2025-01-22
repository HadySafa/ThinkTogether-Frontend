import styles from './style.module.css'
import { FaCircleUser } from "react-icons/fa6";
import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MyContext from '../Context';
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import { IoMdLink } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowCircleUp } from "react-icons/fa";

function Post() {

    // check if user logged in
    const { token } = useContext(MyContext);
    const navigate = useNavigate(null)
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token]);

    const [copied, setCopied] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [viewComments, setViewComments] = useState(false)
    const comment = useRef()

    // will be removed, data will be given from parent component, and comments via an api
    const data = {
        username: "hadysafa__",
        title: 'The frontend journey',
        description: `This is the place where the description of the post will be placed. This is the place where the description of the post will be placed. This is the place where the description of the post will be placed.`,
        link: `https://github.com/hadysafa`,
        code: `console.log("Welcome to our website!)`,
        tags: ["Tag1", "Tag2", "Tag3"],

    }
    const comments = [
        {
            username: "hadysafa__",
            comment: "Great work hady!"
        },
        {
            username: "hadysafa__",
            comment: "Loved It"
        },
        {
            username: "hadysafa__",
            comment: "Awesome"
        }
    ]

    // related to the code block
    function copyToClipboard(code) {
        const content = code;
        navigator.clipboard.writeText(content).then(
            () => {
                setCopied(true)
            },
            (err) => {
                setCopied(false)
            }
        );
    }

    // show/hide comments field
    function toggleShowComments() {
        if (viewComments) setViewComments(false)
        else setViewComments(true)
    }

    // make a reaction 
    function handleReaction(reaction) {
        if (reaction == "Like") {
            setLiked(true)
            setDisliked(false)
        }
        else {
            setLiked(false)
            setDisliked(true)
        }
    }


    return (
        <div className={styles.container}>

            <div className={styles.row1}>
                <div>
                    <div className={styles.logo}>< FaCircleUser /></div>
                    <div><h4>{data.username}</h4></div>
                </div>
                <div>
                    <div className={styles.reactionContainer}>< SlLike className={`${liked ? styles.active : null}`} onClick={() => handleReaction("Like")} /></div>
                    <div className={styles.reactionContainer}>< SlDislike className={`${disliked ? styles.active : null}`} onClick={() => handleReaction("Dislike")} /></div>
                </div>
            </div>

            <div>
                <h2 className={styles.postTitle}>{data.title}</h2>
            </div>

            <div>
                <p className={styles.description}>
                    {data.description}
                </p>
            </div>

            {
                data.link
                    ?
                    <div className={styles.link}>
                        <span><IoMdLink /></span>
                        <a href={data.link} target='_blank'>{data.link}</a>
                    </div>
                    : null
            }

            {
                data.tags
                    ? <div className={styles.tags}>
                        {
                            data.tags.map((tag, index) => <span key={index}>#{tag} </span>)
                        }
                    </div>
                    : null
            }

            {
                data.code
                    ?
                    <div className={styles.codeBlock}>
                        <div className={styles.codeHeader}>
                            <p>Code</p>
                            <button className={styles.copyButton} onClick={() => copyToClipboard(data.code)}>{copied ? "Copied" : "Copy"}</button>
                        </div>
                        <pre><code>
                            {data.code}
                        </code></pre>
                    </div>
                    : null
            }

            <div className={styles.commentContainer}>
                <input type='text' ref={comment} className={styles.commentField} placeholder='Share a comment' />
                <span className={styles.sendIcon}><FiSend /></span>
            </div>

            <div>
                <div onClick={toggleShowComments} className={styles.firstRow}>{viewComments ? "Hide Comments" : "View Comments"} {viewComments ? <FaArrowCircleUp /> : <FaArrowCircleDown />}</div>
                {
                    viewComments
                        ?
                        <div className={styles.subCommentsField}>
                            {
                                comments
                                    ? comments.map((obj, index) => <div className={styles.comment} key={index}><p className={styles.commentUsername}>{obj.username}</p><p>{obj.comment}</p></div>)
                                    : <p>No Comments yet</p>
                            }
                        </div>
                        : null
                }
            </div>

        </div>
    )

}

export default Post