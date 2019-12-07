import originalDayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

originalDayjs.extend(relativeTime);

const dayjs = originalDayjs;

export default dayjs;
