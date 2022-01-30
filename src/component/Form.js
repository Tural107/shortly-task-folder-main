import { useState, useRef } from "react";
import { InputGroup } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
import { useCopyClipboard } from "../hooks";
import classNames from "classnames";
import API from "../api";

function Form() {
  const [link, setLink] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [isCopied, copyClipboard] = useCopyClipboard(1000);
  const [term, setTerm] = useState("");

  const [copy, setCopy] = useState("Copy");

  const [arr, setArr] = useState([]);

  const btnRef = useRef([]);

  console.log(btnRef, "btn ref");

  const handleHistory = async (e) => {
    e.preventDefault();
    setArr([]);
  };
  const buttonClass = classNames("btn mt-2", "btn-primary");

  // const handleCopy = (shortLink) => {
  //   setTerm(shortLink);
  //   copyClipboard(term);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (link.trim() !== "" && link.includes(".")) {
      setError("");
      const { data } = await API.get("/v2/shorten", {
        params: {
          url: link,
        },
      });

      setResult([...result, data.result]);

      // const obj = {
      //   link: data.result.original_link,
      //   shortLink: data.result.full_short_link,
      //   key: Math.random(),
      // };
      // const ts = arr.every((item) => item.link !== obj.link);
      // if (ts) {
      //   arr.push(obj);
      // }
    } else {
      if (link.trim() === "") {
        setError("Input Bos Buraxila Bilmez!!!");
      } else {
        setError("Inputa Duzgun Link Daxil Edin!!!");
      }
    }

    // console.log(link, "link");
  };

  console.log(btnRef.current, "array");

  const handleCopyBtn = (term, idx) => {
    btnRef.current[idx].innerHTML = "Copied";
    // handleCopy(term);

    const timer = setTimeout(() => {
      btnRef.current[idx].innerHTML = "Copy";
    }, 1000);

    copyClipboard(term);
  };

  return (
    <div className="container col-7 mt-5">
      <form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <FormControl
            className="m-3 col-4 rounded "
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            onChange={(e) => setLink(e.target.value)}
          />
          <Button
            type="submit"
            className="col-2 m-3  rounded"
            size="lg"
            variant="primary"
          >
            Create Short Link
          </Button>
        </InputGroup>
      </form>

      {result.short_link ? (
        <div className="alert alert-primary " role="alert">
          <p>
            <a href={result.full_short_link}>{result.short_link}</a>
            <br />
            <a href={result.original_link}>{result.original_link}</a>
          </p>
          {error.trim() ? <p>{error} </p> : ""}
        </div>
      ) : (
        ""
      )}
      <Card>
        <Button
          type="submit"
          className="col-2 m-3  rounded"
          size="lg"
          variant="primary"
          onClick={handleHistory}
        >
          Clear History
        </Button>
      </Card>

      {/* {arr.map((links) => (
        <Card key={links.key} className="mt-2">
          <Card.Body>
            <a href={links.link}>{links.link}</a>
            <br />
            <a href={links.shortLink}>Short Link</a>
            <button
              onClick={() => handleCopy(links.shortLink)}
              className={buttonClass}
            >
              {isCopied ? "Copied" : "Copy"}{" "}
            </button>
          </Card.Body>
        </Card>
      ))} */}

      {result.map((links, idx) => (
        <Card key={Math.random()} className="mt-2">
          <Card.Body>
            <a href={links.original_link}>{links.original_link}</a>
            <br />
            <a href={links.short_link}>{links.short_link}</a>
            <button
              ref={(el) => (btnRef.current[idx] = el)}
              onClick={() => handleCopyBtn(links.short_link, idx)}
              className={buttonClass}
            >
              {copy}
            </button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Form;
