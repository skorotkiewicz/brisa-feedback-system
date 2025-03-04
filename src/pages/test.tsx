import { dangerHTML } from "brisa";

const Test = () => {
  return (
    <div>
      {dangerHTML(`
        <script src="http://localhost:3000/api/widget"></script> 
<script> FeedbackWidget.init('f05cdb2dbd4f8c153089fd7081336a6d'); </script>
        `)}
    </div>
  );
};

export default Test;
