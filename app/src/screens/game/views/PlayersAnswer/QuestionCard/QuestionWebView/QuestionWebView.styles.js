/* !! This is CSS !! */

export default `
.wrapper {
  height: 100%;
  position: relative;
}

.text {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14pt;
  color: #eee;
  text-align: center;
  line-height: 25px;
}

.compact {
  font-size: 12pt;
  line-height: 18px;
}

.answers {
  margin-top: 15px;
}

.compact .answers {
  margin-top: 5px;
}

.blank {
  display: inline-block;
  width: 40px;
  margin: 0 5px;
  border-bottom: 1px solid #eee;
  position: relative;
  top: 2px;
}

.answers .blank {
  min-height: 15px;
}

.choice {
  color: #fff;
  font-weight: bold;
}

.answers .choice {
  margin: 0 10px;
}
`;
