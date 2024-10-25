import colors from "colors";

class InviteClass {
  constructor() {}

  async getInviteBalance(user) {
    try {
      const { data } = await user.http.get(3, "friends/balance");
      if (data) {
        return data;
      } else {
        throw new Error(
          `Failed to get invite balance information: ${data.message}`
        );
      }
    } catch (error) {
      user.log.logError(
        `Failed to get invite balance information: ${error.response?.data?.message}`
      );
      return 0;
    }
  }

  async claimInviteRewards(user) {
    try {
      const { data } = await user.http.post(3, "friends/claim", {});
      if (data) {
        user.log.log(
          `Successfully claimed referral points, received: ${colors.green(
            data?.claimBalance + user.currency
          )}`
        );
        return true;
      } else {
        throw new Error(`Failed to claim referral points: ${data.message}`);
      }
    } catch (error) {
      user.log.logError(
        `Failed to claim referral points: ${error.response?.data?.message}`
      );
      return false;
    }
  }

  async handleInvite(user) {
    const balance = await this.getInviteBalance(user);
    if (balance.amountForClaim > 0 && balance.canClaim) {
      await this.claimInviteRewards(user);
    }
  }
}

const inviteClass = new InviteClass();
export default inviteClass;