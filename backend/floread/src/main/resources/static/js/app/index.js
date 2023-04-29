//굳이 index라는 변수의 속성으로 function을 추가한 이유는 뭘까요?

//index.mustache에서 a.js가 추가되어 a.js도 a.js만의 init과 save fucntion이 있다면 어떻게 될까요?

//브라우저의 스코프는 **공용 공간**으로 쓰이기 대문에 나중에 로딩된 js의 init, save가 먼저 로딩된 js의 function을 덮어쓰게 됩니다.
//여러 사람이 참여하는 프로젝트에서는 **중복된 함수 이름**은 자주 발생할 수 있습니다. 모든 function이름을 확인하면서 만들 수는 없습ㄴ디ㅏ.
//그러다보니 이런 문제를 피하려고 index.js만의 유효범위(스코프)를 만들어 사용합니다.
//방법은 let index이란 객체를 만들어 해당 객체에서 필요한 모든 function을 선언하는 것입니다.
//이렇게 하면 **index 객체 안에서만 function이 유효하기 때문에** 다른 JS와 겹칠 위험이 사라집니다.

const main = {
    init: function () {
        let _this = this;
        // $("#btn-add").on("click", () => {
        //     _this.add();
        // });
        $("#btn-save").on("click", () => {
            _this.save();
        });
        $("#btn-update").on("click", () => {
            _this.update();
        });
        $("#btn-delete").on("click", () => {
            _this.delete();
        });
    },
    save: () => {
        let data = {
            title: $("#title").val(),
            author: $("#author").val(),
            content: $("#content").val(),
        };

        $.ajax({
            type: "POST",
            url: "/api/v1/posts",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
        })
            .done(() => {
                alert("글이 등록되었습니다.");
                window.location.href = "/"; // 글 등록이 성공하면 메인페이지로 리다이렉트
            })
            .fail((error) => {
                alert(JSON.stringify(error));
            });
    },
    // add: function () {
    //     window.location.href = "/posts/save";
    // },
    update: function () {
        let data = {
            title: $("#title").val(),
            content: $("#content").val(),
        };

        let id = $("#id").val();

        $.ajax({
            type: "PUT",
            url: "/api/v1/posts/" + id,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
        })
            .done(() => {
                alert("글이 수정되었습니다.");
                window.location.href = "/"; // 글 등록이 성공하면 메인페이지로 리다이렉트
            })
            .fail((error) => {
                alert(JSON.stringify(error));
            });
    },
    delete: function () {
        let id = $("#id").val();

        $.ajax({
            type: "DELETE",
            url: "/api/v1/posts/" + id,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        })
            .done(() => {
                alert("글이 삭제되었습니다.");
                window.location.href = "/"; // 글 등록이 성공하면 메인페이지로 리다이렉트
            })
            .fail((error) => {
                alert(JSON.stringify(error));
            });
    },
};

main.init();
