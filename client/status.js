/*
TODO: Detecter si un schema existe pour Meteor.users et vérifier si champs status déclaré
TODO: Tableau simple du status par utilisateur
TODO: Router.route paramètrable
*/

UserConnections = new Mongo.Collection("user_status_sessions");

var relativeTime = function(timeAgo) {
    var ago, days, diff, time;
    diff = moment.utc(TimeSync.serverTime() - timeAgo);
    time = diff.format("H:mm:ss");
    days = +diff.format("DDD") - 1;
    ago = (days ? days + "d " : "") + time;
    return ago + " ago";
};

Template.registerHelper("userStatus", UserStatus); //exporté par meteor-user-status

Template.registerHelper("localeTime", function(date) {
    return date != null ? date.toLocaleString() : void 0;
});

Template.registerHelper("relativeTime", relativeTime);

Template.liveStatus.events({
    "submit form.start-monitor": function(e, tmpl) {
      e.preventDefault();
      return UserStatus.startMonitor({
        threshold: tmpl.find("input[name=threshold]").valueAsNumber,
        interval: tmpl.find("input[name=interval]").valueAsNumber,
        idleOnBlur: tmpl.find("select[name=idleOnBlur]").value === "true"
      });
    },
    "click .stop-monitor": function() {
      return UserStatus.stopMonitor();
    },
    "click .resync": function() {
      return TimeSync.resync();
    }
});

Template.liveStatus.helpers({
    lastActivity: function() {
      var lastActivity = UserStatus.lastActivity();
      if (lastActivity) {
        return relativeTime(lastActivity);
      }
    },
    serverTime: function() {
      return new Date(TimeSync.serverTime()).toLocaleString();
    },
    serverOffset: TimeSync.serverOffset,
    serverRTT: TimeSync.roundTripTime,
    isIdleText: function() {
      return UserStatus.isIdle() || "Désactivé";
    },
    isMonitoringText: function() {
      return UserStatus.isMonitoring() || "Désactivé";
    },
    isMonitoring: function() {
      return UserStatus.isMonitoring();
    },
});

Template.serverStatus.helpers({
    anonymous: function() {
      return UserConnections.find({
        userId: {
          $exists: false
        }
      });
    },
    users: function() {
      return Meteor.users.find();
    },
    userClass: function() {
      var ref;
      //if ((ref = this.status) != null ? ref.idle : void 0) {
      if (this.status && this.status.idle) {
        return "warning";
      } else {
        return "success";
      }
    },
    connections: function() {
      return UserConnections.find({
        userId: this._id
      });
    }
  });

Template.userPill.helpers({
    labelClass: function() {
        //console.log("userPill this : ", this); // instance de user
        if (this.status && this.status.idle) {
            return "label-warning";
        } else if (this.status && this.status.online) {
            return "label-success";
        } else {
            return "label-default";
        }
    }
});

Template.serverConnection.helpers({
    connectionClass: function() {
        console.log(JSON.stringify(this, null, '\t'));
        /*
        Avec activité:
        {
        	"ipAddr": "127.0.0.1",
        	"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
        	"userId": "oeHsiZd95C3N34sNT",
        	"loginTime": "2015-06-24T15:49:38.664Z",
        	"idle": true,
        	"lastActivity": "2015-06-24T15:49:55.587Z",
        	"_id": "99bAMNhjcMGbv76wm"
        }

        Sans activité:
        {
        	"ipAddr": "127.0.0.1",
        	"userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
        	"_id": "99bAMNhjcMGbv76wm"
        }

        */
        if (this.idle) {
            return "warning";
        } else {
            return "success";
        }
    },
    loginTime: function() {
      if (this.loginTime == null) {
        return;
      }
      return new Date(this.loginTime).toLocaleString();
    }
});

Tracker.autorun(function(c) {
    try {
      UserStatus.startMonitor({
        threshold: 30000,
        idleOnBlur: true
      });
      return c.stop();
    } catch (_error) {}
});

