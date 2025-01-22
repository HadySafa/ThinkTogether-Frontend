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

function Post({ postData }) {

    // check if user logged in
    const { token, id } = useContext(MyContext);
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

    const currentUserId = id;
    const [userId, setUserId] = useState(postData.UserId)
    const [postId, setPostId] = useState(postData.Id)
    const [comments, setComments] = useState([])
    const comment = useRef()


    // will be removed, data will be given from parent component, and comments via an api
    const data = {
        username: postData.Username,
        title: postData.Title,
        description: postData.Description,
        link: postData.Link,
        code: postData.CodeSnippet,
    }

    const tags = []

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
                addReaction(reaction)
            }
            else if(reaction == "DisLike"){
                setLiked(false)
                setDisliked(true)
                addReaction(reaction)
            }
    }
    async function addReaction(reaction) {
        if (reaction) {
            const obj = {
                UserId: currentUserId,
                PostId: postId,
                Reaction: reaction
            }
            console.log(obj)
            const url = "http://localhost/SharingPlatform/api.php/Posts/Reactions";
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                });
                if (response.ok){
                    return true
                }
                else{
                    throw new Error("Creation Failed");
                }

            } catch (err) {
                console.log("ERROR HERE: " + err);
            }
        }
    }

    // function to get comments
    async function getComments() {
        const url = "http://localhost/SharingPlatform/api.php/Posts/Comments/" + postId;
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setComments(data)
            }
        }
        catch (error) {
            console.log(error.message)
        }
    }
    useEffect( () => {
        getComments();
    },[])
    
    // function to add new comment
    async function addComment() {
        const submittedComment = comment.current.value;
        if (submittedComment) {
            const obj = {
                UserId: currentUserId,
                PostId: postId,
                Comment: submittedComment
            }
            console.log(obj)
            const url = "http://localhost/SharingPlatform/api.php/Posts/Comments";
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                });
                if (response.ok){
                    getComments();
                    comment.current.value = ""
                }
                else{
                    throw new Error("Creation Failed");
                }

            } catch (err) {
                console.log("ERROR HERE: " + err);
            }
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
                <span onClick={addComment} className={styles.sendIcon}><FiSend /></span>
            </div>

            <div>
                <div onClick={toggleShowComments} className={styles.firstRow}>{viewComments ? "Hide Comments" : "View Comments"} {viewComments ? <FaArrowCircleUp /> : <FaArrowCircleDown />}</div>
                {
                    viewComments
                        ?
                        <div className={styles.subCommentsField}>
                            {
                                comments
                                    ? comments.map((obj, index) => <div className={styles.comment} key={index}><p className={styles.commentUsername}>{obj.Username}</p><p>{obj.Comment}</p></div>)
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