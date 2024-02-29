// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Result from './Result';
// import styles from './SearchBar.module.css';
// import { response } from 'express';
// const SearchBar = () => {
//     const [searchVal, setSearchVal] = useState("");
//     const [suggestionList, setSuggestionList] = useState([]);
//     const [hideSuggestions, setHideSuggestions] = useState(true);
//     const [result, setResult] = useState(null);

//     const findResult = (title) => {
//         setResult(suggestionList.find((suggestionList.title === title)));
//     }

//     // useEffect(() => {
//     //     const fetchForums = async () => {
//     //         try {
//     //             fetch(`http://localhost:5001/api/forums/forumTopic/${searchVal}`)
//     //                 .then((response) => response.json())
//     //                 .then((responseJson) => {
//     //                     setSuggestionList(responseJson.topic);
//     //                 })
                
//     //         } catch (err) {
//     //             console.log(err);
//     //         }
//     //     };
//     //     fetchForums();
//     // }, [searchVal]);

//     return (
//         <>
//         <div className={styles.container}>
//             <input
//                 onFocus={() => setHideSuggestions(false)}
//                 onBlur={async () => {
//                     setTimeout(() => {
//                         setHideSuggestions(true);
//                     }, 200);
//                 }}
//                 type="text"
//                 className={styles.textbox}
//                 placeholder="Search forums..."
//                 searchVal={searchVal}
//                 onChange={(event) => {
//                     setSearchVal(event.target.value);
//                 }}
//             />
//             <div
//                 className={`${styles['suggestions']} ${hideSuggestions && styles['hidden']}`}
//             >
//                 {suggestionList.map(() => (
//                     <div 
//                         className={styles.suggestions}>
//                         onClick={() => findResult(suggestionList['topic'])}
//                     </div>
//                 ))}
//             </div>
//         </div>
//         {result && <Result {...result} />}
//         </>
//     );
// };

// export default SearchBar;