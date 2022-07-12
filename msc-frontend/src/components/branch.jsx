handleBranchingSelection() {

	let formItemsId = [];
    
  this.props.formItems.map((item) => formItemsId.push(item.id));
	this.branchingOptions = [];
	let tempBranch = [];

	let formItemsLength = this.props.formItems.length;
    let currentId = this.props.questionData.id;
    let nextId = this.findNextId();

    formItemsId.map((id) => {
      if (id == nextId) {
        let obj = {
          value: 0,
          label: "Continue to the next question",
          idValue: id,
        };
        tempBranch.push(obj);
      }
      if (id != currentId) {
        let obj = { value: id, label: "Go to Question " + id, idValue: id };
        tempBranch.push(obj);
      }
    });

    this.branchingOptions = tempBranch;
}

findNextId() {
    let currentId = this.props.questionData.id;
    let flag = -1;
    let nextId = 0;

    this.props.formItems.map((item) => {
      if (flag == 0) {
        nextId = item.id;
        flag = -1;
      }
      if (item.id == currentId) {
        flag = 0;
      }
    });

    // console.log("nextId: " + nextId);
    return nextId;
}