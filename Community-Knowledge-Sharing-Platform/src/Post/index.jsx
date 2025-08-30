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
import { FaPen } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function Post({ postData, forProfile, setRefresh }) {

    // note: handle loading and error states

    // check if user logged in
    const { id } = useContext(MyContext);
    const navigate = useNavigate(null)

    const [copied, setCopied] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [makeReaction, setMakeReaction] = useState(false)
    const [viewComments, setViewComments] = useState(false)
    const [viewReactions, setViewReactions] = useState(false)
    const currentUserId = id;
    const [postId, setPostId] = useState(postData.id)
    const [comments, setComments] = useState([])
    const [tags, setTags] = useState([])
    const [reactions, setReactions] = useState([])
    const comment = useRef()
    const data = {
        username: postData.user.username,
        title: postData.title,
        description: postData.description,
        link: postData.link,
        code: postData.codesnippet,
        category: postData.category.name,
        likes: postData?.like_count
    }

    // related to the code block
    function copyToClipboard(code) {
        const content = code;
        navigator.clipboard.writeText(content).then(
            () => {
                setCopied(true)
            },
            () => {
                setCopied(false)
            }
        );
    }

    const { token } = useContext(MyContext);
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token]);

    // function to get reaction
    async function getReaction() {
        const url = "http://localhost:8000/api/posts/" + postId + "/reactions";
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer' + token
                }
            });
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setReactions(data.reactions)
            }
        }
        catch (error) {
            // handle error
        }
    }
    useEffect(() => { getReaction(); }, [makeReaction])
    useEffect(() => {
        reactions.filter((reaction) => {
            if (currentUserId == reaction.user_id) {
                if (reaction.reaction == "Like") {
                    setLiked(true)
                    setDisliked(false)
                }
                else if (reaction.reaction == "Dislike") {
                    setLiked(false)
                    setDisliked(true)
                }
            }
        })
    }, [reactions])

    // function to get tags
    async function getTags() {
        const url = "http://localhost:8000/api/posts/" + postId + "/tags";
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setTags(data.tags)
            }
        }
        catch (error) {
            // handle error
        }
    }
    useEffect(() => {
        getTags();
    }, [])

    // show/hide comments / reactions field
    function toggleShowComments() {
        if (viewComments) setViewComments(false)
        else {
            setViewComments(true)
            setViewReactions(false)
        }
    }
    function toggleShowReactions() {
        if (viewReactions) setViewReactions(false)
        else {
            setViewComments(false)
            setViewReactions(true)
        }
    }

    // make a reaction 
    function handleReaction(reaction) {
        if (reaction == "Like" && !liked) {
            setMakeReaction(false)
            addReaction(reaction)
        }
        else if (reaction == "Dislike" && !disliked) {
            setMakeReaction(false)
            addReaction(reaction)
        }
    }

    async function addReaction(reaction) {
        if (reaction) {
            const obj = {
                user_id: currentUserId,
                reaction: reaction
            }
            const url = "http://localhost:8000/api/posts/" + postId + "/reactions";
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer" + token
                    },
                    body: JSON.stringify(obj),
                });
                if (response.ok) {
                    setMakeReaction(true)
                    return true
                }
                else {
                    throw new Error("Creation Failed");
                }

            } catch (err) {
                // 
            }
        }
    }

    // function to get comments
    async function getComments() {
        const url = "http://localhost:8000/api/posts/" + postId + "/comments";
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer' + token
                }
            });
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setComments(data.comments)
            }
        }
        catch (error) {
            //
        }
    }
    useEffect(() => {
        getComments();
    }, [])

    // function to add new comment
    async function addComment() {
        const submittedComment = comment.current.value;
        if (submittedComment) {
            const obj = {
                user_id: currentUserId,
                comment: submittedComment
            }
            const url = "http://localhost:8000/api/posts/" + postId + "/comments";
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer" + token
                    },
                    body: JSON.stringify(obj),
                });
                if (response.ok) {
                    getComments();
                    comment.current.value = ""
                }
                else {
                    throw new Error("Creation Failed");
                }

            } catch (err) {
                // 
            }
        }
    }

    // profile methods
    async function handleDelete() {
        const url = "http://localhost:8000/api/posts/" + postId;
        console.log(url)
        try {
            setRefresh(false)
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer" + token
                }
            });
            if (!response.ok) throw new Error("");
            setRefresh(true)
        }
        catch (error) {
            //
        }
    }

    function handleEdit() {
        const data = {
            id: postData.id,
            title: postData.title,
            description: postData.description,
            link: postData.link,
            codesnippet: postData.codesnippet
        }
        navigate('/EditPost', { state: data });
    }

    return (

        <div className={styles.container}>

            <div className={styles.row1}>
                <div>
                    <div className={styles.logo}>< FaCircleUser /></div>
                    <div><h4>{data.username}</h4></div>
                </div>
                <div>
                    {
                        !forProfile
                            ? <>
                                <div className={styles.reactionContainer}>{data?.likes}< SlLike className={`${liked ? styles.active : null}`} onClick={() => handleReaction("Like")} /></div>
                                <div className={styles.reactionContainer}>< SlDislike className={`${disliked ? styles.active : null}`} onClick={() => handleReaction("Dislike")} /></div>
                            </>
                            : <>
                                <div className={styles.reactionContainer}>< FaPen onClick={handleEdit} /></div>
                                <div className={styles.reactionContainer}>< MdDelete className={styles.icon} onClick={handleDelete} /></div>
                            </>
                    }
                </div>
            </div>

            <div>
                <h2 className={styles.postTitle}>{data.category}: {data.title}</h2>
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
                tags && tags.length > 0
                    ? <div className={styles.tags}>
                        {
                            tags.map((tag, index) => <span key={index}>#{tag.name} </span>)
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

            {
                forProfile
                    ? null
                    : <div className={styles.commentContainer}>
                        <input type='text' ref={comment} className={styles.commentField} placeholder='Share a comment' />
                        <span onClick={addComment} className={styles.sendIcon}><FiSend /></span>
                    </div>
            }

            <div>
                <div onClick={toggleShowComments} className={styles.firstRow}>{viewComments ? "Hide Comments" : "View Comments"} {viewComments ? <FaArrowCircleUp /> : <FaArrowCircleDown />}</div>
                {
                    viewComments
                        ?
                        <div className={styles.subCommentsField}>
                            {
                                comments && comments.length > 0
                                    ? comments.map((obj, index) => <div className={styles.comment} key={index}><p className={styles.commentUsername}>{obj.user.username}</p><p>{obj.comment}</p></div>)
                                    : <p className={styles.redHighlight}>No Comments yet</p>
                            }
                        </div>
                        : null
                }
                {
                    forProfile
                        ?
                        <>
                            <div onClick={toggleShowReactions} className={`${styles.firstRow} ${styles.showReactionContainer}`}>{viewReactions ? "Hide Reactions" : "View Reactions"} {viewReactions ? <FaArrowCircleUp /> : <FaArrowCircleDown />}</div>
                            {
                                viewReactions
                                    ?
                                    <div className={styles.subCommentsField}>
                                        {
                                            reactions && reactions.length > 0
                                                ? reactions.map((obj, index) => <div className={styles.comment} key={index}><p><span className={styles.commentUsername}>{obj.user.username}</span> {obj.reaction}d your post.</p></div>)
                                                : <p className={styles.redHighlight}>No reactions yet</p>
                                        }
                                    </div>
                                    : null
                            }
                        </>
                        : null
                }
            </div>

        </div>
    )

}

export default Post